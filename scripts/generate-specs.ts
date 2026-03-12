// scripts/generate-specs.ts

import { writeFileSync } from 'fs'
import { buildSpecMd } from './spec-tools'
import { specManifest } from './spec-manifest'

// -- Manifest validation ------------------------------------------------------

function validateManifest(): { valid: typeof specManifest; errors: string[] } {
  const valid: typeof specManifest = []
  const errors: string[] = []

  for (const entry of specManifest) {
    let resolvedPath: string
    try {
      resolvedPath = require.resolve(entry.specPath)
    } catch {
      errors.push(`x ${entry.name}: file not found — ${entry.specPath}`)
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(resolvedPath)
    if (!mod[entry.exportName]) {
      errors.push(`x ${entry.name}: export '${entry.exportName}' not found in ${resolvedPath}`)
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

  const { valid: validEntries, errors: manifestErrors } = validateManifest()
  if (manifestErrors.length > 0) {
    console.error('\nManifest validation failed:')
    manifestErrors.forEach(e => console.error(`  ${e}`))
    console.error(`\nFix the manifest (scripts/spec-manifest.ts) and re-run.\n`)
    process.exit(1)
  }

  for (const entry of validEntries) {
    const mod = await import(entry.specPath)
    const spec = mod[entry.exportName]

    const specFile = require.resolve(entry.specPath)
    const mdPath = specFile.replace(/\.spec\.ts$/, '.spec.md')

    const content = buildSpecMd(entry.name, spec)
    writeFileSync(mdPath, content)
    console.log(`  ${entry.name}: wrote ${mdPath}`)
  }
}

main().catch(err => {
  console.error('generate-specs failed:', err)
  process.exit(1)
})
