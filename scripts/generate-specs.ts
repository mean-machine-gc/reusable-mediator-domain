// scripts/generate-specs.ts

import { writeFileSync } from 'fs'
import { globSync } from 'glob'
import { resolve, basename } from 'path'
import { buildSpecMd } from './spec-tools'

async function main() {
  const specFiles = globSync('src/domain/**/*.spec.ts')

  if (specFiles.length === 0) {
    console.log('No .spec.ts files found.')
    return
  }

  let generated = 0

  for (const file of specFiles) {
    const resolvedPath = resolve(file)
    const mod = await import(resolvedPath)

    // Find exported specs with document: true
    for (const [exportName, value] of Object.entries(mod)) {
      if (
        value &&
        typeof value === 'object' &&
        'document' in value &&
        (value as any).document === true
      ) {
        const name = basename(file, '.spec.ts')
        const mdPath = resolvedPath.replace(/\.spec\.ts$/, '.spec.md')
        const content = buildSpecMd(name, value)
        writeFileSync(mdPath, content)
        console.log(`  ${name} (${exportName}): wrote ${mdPath}`)
        generated++
      }
    }
  }

  if (generated === 0) {
    console.log('No specs with document: true found — nothing to generate.')
  } else {
    console.log(`\nGenerated ${generated} .spec.md file(s).`)
  }
}

main().catch(err => {
  console.error('generate-specs failed:', err)
  process.exit(1)
})
