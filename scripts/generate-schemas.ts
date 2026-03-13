// scripts/generate-schemas.ts
//
// Generates TypeBox schemas from types.ts files.
//
// Pipeline:
//   1. Read target types.ts
//   2. Resolve imports by inlining referenced types from shared/ files
//   3. Stub external packages (e.g. cloudevents)
//   4. Strip failure unions, re-exports, and parse functions (not needed for schemas)
//   5. Run TypeBox codegen
//   6. Post-process: add UUID pattern to ID, add header comment
//   7. Write schemas.ts alongside the source types.ts

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { globSync } from 'glob'
import { TypeScriptToTypeBox } from '@sinclair/typebox-codegen'

// ── Config ──────────────────────────────────────────────────────────────────

const EXTERNAL_STUBS: Record<string, string> = {
    cloudevents: 'type CloudEvent = Record<string, unknown>',
}

const ID_UUID_PATTERN = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'

const HEADER = `// AUTO-GENERATED — do not edit manually.
// Source: types.ts | Generator: scripts/generate-schemas.ts
`

// ── Helpers ─────────────────────────────────────────────────────────────────

function readSource(filePath: string): string {
    return readFileSync(filePath, 'utf-8')
}

/** Extract type-only content from a source file: type aliases and object types, with JSDoc. */
function extractTypes(source: string): string {
    const lines = source.split('\n')
    const result: string[] = []
    let i = 0

    while (i < lines.length) {
        const line = lines[i]

        // Skip import statements
        if (line.match(/^import\s/)) {
            // Multi-line imports
            if (!line.includes('}') && line.includes('{')) {
                while (i < lines.length && !lines[i].includes('}')) i++
            }
            i++
            continue
        }

        // Skip re-exports (export type { ... } from ...)
        if (line.match(/^export\s+type\s*\{/)) {
            i++
            continue
        }

        // Skip export { ... } from
        if (line.match(/^export\s*\{/)) {
            i++
            continue
        }

        // Skip failure unions (type ...Failure = ...)
        if (line.match(/^export\s+type\s+\w+Failure\s*=/)) {
            // Skip multi-line union
            i++
            while (i < lines.length && lines[i].match(/^\s*\|/)) i++
            continue
        }

        // Skip const declarations (parse functions, etc.)
        if (line.match(/^export\s+const\s/) || line.match(/^const\s/)) {
            // Skip until next blank line or next export/type
            i++
            let braceDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
            while (i < lines.length && braceDepth > 0) {
                braceDepth += (lines[i].match(/\{/g) || []).length
                braceDepth -= (lines[i].match(/\}/g) || []).length
                i++
            }
            continue
        }

        // Strip 'export' keyword — codegen output will re-add exports
        const stripped = line.replace(/^export\s+/, '')
        result.push(stripped)
        i++
    }

    return result.join('\n')
}

/** Extract import paths from source (handles multi-line imports, skips re-exports) */
function extractImportPaths(source: string): string[] {
    const paths: string[] = []
    // Collapse multi-line imports into single lines
    const collapsed = source.replace(/import\s+type\s*\{[^}]*\}\s*from/gs, match =>
        match.replace(/\n/g, ' ')
    )
    for (const line of collapsed.split('\n')) {
        // Skip re-exports: export type { ... } from '...' or export { ... } from '...'
        if (line.match(/^export\s/)) continue
        // Match import ... from '...'
        const match = line.match(/from\s+['"]([^'"]+)['"]/)
        if (match) paths.push(match[1])
    }
    return [...new Set(paths)]
}

/** Build a self-contained TypeScript source for codegen */
function buildCodegenInput(typesPath: string): string {
    const typesSource = readSource(typesPath)
    const typesDir = dirname(typesPath)
    const parts: string[] = []

    // 1. Extract all import paths (handles multi-line imports)
    const importPaths = extractImportPaths(typesSource)

    // 2. Collect external stubs needed
    for (const p of importPaths) {
        if (!p.startsWith('.') && EXTERNAL_STUBS[p]) {
            parts.push(EXTERNAL_STUBS[p])
        }
    }

    // 3. Collect local imports and inline their types
    const resolvedFiles = new Set<string>()

    for (const relPath of importPaths.filter(p => p.startsWith('.'))) {
        if (!relPath) continue

        const absPath = resolve(typesDir, relPath + '.ts')
        if (resolvedFiles.has(absPath)) continue
        resolvedFiles.add(absPath)

        // Recursively resolve the dependency's own imports
        const depSource = readSource(absPath)
        const depLocalPaths = extractImportPaths(depSource).filter(p => p.startsWith('.'))
        for (const depRelPath of depLocalPaths) {
            const depAbsPath = resolve(dirname(absPath), depRelPath + '.ts')
            if (resolvedFiles.has(depAbsPath)) continue
            resolvedFiles.add(depAbsPath)
            parts.push(extractTypes(readSource(depAbsPath)))
        }

        parts.push(extractTypes(depSource))
    }

    // 3. Add the target file's own types
    parts.push(extractTypes(typesSource))

    // 4. Join and clean up
    let combined = parts.join('\n\n')
    combined = combined.replace(/\n{3,}/g, '\n\n').trim()

    return combined
}

/** Post-process generated TypeBox code */
function postProcess(generated: string): string {
    let result = generated

    // Add UUID pattern to ID schema (codegen can't handle regex in JSDoc)
    result = result.replace(
        /const ID = Type\.String\(\{([^}]*)\}\)/,
        `const ID = Type.String({$1,"pattern":"${ID_UUID_PATTERN}"})`
    )

    // Remove unsupported format annotations (TypeBox doesn't validate these by default)
    result = result.replace(/,"format":"[^"]*"/g, '')

    // Export all const declarations
    result = result.replace(/^(const \w+)/gm, 'export $1')

    // Export all type declarations
    result = result.replace(/^(type \w+)/gm, 'export $1')

    return result
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
    // Accept specific path or glob all types.ts files
    const args = process.argv.slice(2)
    const targetFiles = args.length > 0
        ? args
        : globSync('src/**/types.ts', { ignore: ['src/shared/**'] })

    if (targetFiles.length === 0) {
        console.log('No types.ts files found.')
        return
    }

    for (const file of targetFiles) {
        const absPath = resolve(file)
        const outPath = absPath.replace(/types\.ts$/, 'schemas.ts')

        console.log(`Processing: ${file}`)

        try {
            const input = buildCodegenInput(absPath)
            console.log('  Codegen input built, running TypeBox codegen...')

            const generated = TypeScriptToTypeBox.Generate(input)
            const processed = postProcess(generated)
            const output = HEADER + '\n' + processed + '\n'

            writeFileSync(outPath, output)
            console.log(`  → ${outPath.replace(process.cwd() + '/', '')}`)
        } catch (err) {
            console.error(`  ERROR: ${err instanceof Error ? err.message : err}`)
        }
    }
}

main()
