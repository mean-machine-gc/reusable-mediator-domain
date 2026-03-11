// scripts/generate-specs.ts

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve, dirname, relative } from 'path'
import { flattenSpec, toMarkdownTable, toStepTable } from './spec-tools'
import { specManifest } from './spec-manifest'

const DOCS_SPECS_PATH = resolve(__dirname, '../docs/specs.ts')

const MARKER_BEGIN = (section: string) => `<!-- BEGIN:GENERATED:${section} -->`
const MARKER_END   = (section: string) => `<!-- END:GENERATED:${section} -->`
const STALE_MARKER = '<!-- ⚠ STALE: Generated sections (§4-§5) changed — review this prose section. Run ddd-documentation to update. -->'

function generateSection(tag: string, content: string): string {
  return `${MARKER_BEGIN(tag)}\n${content}\n${MARKER_END(tag)}`
}

function extractGeneratedContent(file: string, tag: string): string {
  const begin = MARKER_BEGIN(tag)
  const end = MARKER_END(tag)
  const regex = new RegExp(
    `${escapeRegex(begin)}\\n([\\s\\S]*?)\\n${escapeRegex(end)}`
  )
  const match = file.match(regex)
  return match ? match[1] : ''
}

function replaceGeneratedSections(existing: string, sections: Record<string, string>): {
  content: string
  changed: boolean
} {
  let result = existing
  let changed = false

  for (const [tag, content] of Object.entries(sections)) {
    const oldContent = extractGeneratedContent(existing, tag)
    if (oldContent !== content) changed = true

    const begin = MARKER_BEGIN(tag)
    const end = MARKER_END(tag)
    const regex = new RegExp(
      `${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`,
      'g'
    )
    if (result.includes(begin)) {
      result = result.replace(regex, generateSection(tag, content))
    } else {
      result += '\n\n' + generateSection(tag, content)
    }
  }

  return { content: result, changed }
}

// When generated sections change, inject a staleness marker above each
// prose section (§1-§3) so authors know the prose may need updating.
function addStaleMarkers(content: string): string {
  // First remove any existing stale markers to avoid duplication
  let result = removeStaleMarkers(content)

  // Add marker before each prose section heading
  for (const heading of ['## 1. Overview', '## 2. Operation Interface', '## 3. Business Scenarios']) {
    result = result.replace(heading, `${STALE_MARKER}\n\n${heading}`)
  }

  return result
}

function removeStaleMarkers(content: string): string {
  return content.replace(new RegExp(escapeRegex(STALE_MARKER) + '\\n\\n?', 'g'), '')
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function newSpecMd(name: string, sections: Record<string, string>): string {
  return `# ${name}

> **Operation Specification**

---

## 1. Overview

<!-- TODO: run ddd-documentation to fill this section -->

---

## 2. Operation Interface

<!-- TODO: run ddd-documentation to fill this section -->

---

## 3. Business Scenarios

<!-- TODO: run ddd-documentation to fill this section -->

---

## 4. Pipeline

${generateSection('PIPELINE', sections.PIPELINE)}

---

## 5. Decision Tables

${generateSection('DECISION', sections.DECISION)}
`
}

// ── Manifest validation ──────────────────────────────────────────────────────
// Checks every manifest entry points to a real file with the expected export.
// Runs before any generation — catches stale entries from renames or deletions.

function validateManifest(): { valid: typeof specManifest; errors: string[] } {
  const valid: typeof specManifest = []
  const errors: string[] = []

  for (const entry of specManifest) {
    let resolvedPath: string
    try {
      resolvedPath = require.resolve(entry.specPath)
    } catch {
      errors.push(`✗ ${entry.name}: file not found — ${entry.specPath}`)
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(resolvedPath)
    if (!mod[entry.exportName]) {
      errors.push(`✗ ${entry.name}: export '${entry.exportName}' not found in ${resolvedPath}`)
      continue
    }

    valid.push(entry)
  }

  return { valid, errors }
}

async function main() {
  if (specManifest.length === 0) {
    console.log('spec-manifest.ts is empty — no specs to generate.')
    return
  }

  // Validate manifest before doing any work
  const { valid: validEntries, errors: manifestErrors } = validateManifest()
  if (manifestErrors.length > 0) {
    console.error('\nManifest validation failed:')
    manifestErrors.forEach(e => console.error(`  ${e}`))
    console.error(`\nFix the manifest (scripts/spec-manifest.ts) and re-run.\n`)
    process.exit(1)
  }

  const generatedPaths: Record<string, string> = {}

  for (const entry of validEntries) {
    const mod = await import(entry.specPath)
    const spec = mod[entry.exportName]

    const table = flattenSpec(spec)
    const pipelineContent = toStepTable(spec)
    const decisionContent = toMarkdownTable(table)

    const sections = {
      PIPELINE: pipelineContent,
      DECISION: decisionContent,
    }

    // Resolve output path: same dir as spec, .spec.md extension
    const specFile = require.resolve(entry.specPath)
    const mdPath = specFile.replace(/\.spec\.ts$/, '.spec.md')

    if (existsSync(mdPath)) {
      const existing = readFileSync(mdPath, 'utf-8')
      const { content: updated, changed } = replaceGeneratedSections(existing, sections)

      if (changed) {
        // Generated content changed — mark prose sections as potentially stale
        const withMarkers = addStaleMarkers(updated)
        writeFileSync(mdPath, withMarkers)
        console.log(`✓ ${entry.name}: updated generated sections in ${mdPath}`)
        console.log(`  ⚠ Prose sections (§1-§3) may be stale — run ddd-documentation to review`)
      } else {
        console.log(`· ${entry.name}: no changes`)
      }
    } else {
      const content = newSpecMd(entry.name, sections)
      writeFileSync(mdPath, content)
      console.log(`✓ ${entry.name}: created ${mdPath}`)
    }

    // Track for docs/specs.ts — path relative to project root
    const projectRoot = resolve(__dirname, '..')
    generatedPaths[entry.name] = relative(projectRoot, mdPath)
  }

  // Update docs/specs.ts — the documentation registry
  const entries = Object.entries(generatedPaths)
    .map(([name, path]) => `  '${name}': '${path}',`)
    .join('\n')
  const docsContent = `// docs/specs.ts
//
// Documentation registry — lists all generated .spec.md files.
// Auto-updated by \`npm run gen:specs\`. Do not edit manually.

export const specDocs: Record<string, string> = {
${entries}
}
`
  writeFileSync(DOCS_SPECS_PATH, docsContent)
  console.log(`✓ docs/specs.ts: updated with ${Object.keys(generatedPaths).length} entries`)
}

main().catch(err => {
  console.error('generate-specs failed:', err)
  process.exit(1)
})
