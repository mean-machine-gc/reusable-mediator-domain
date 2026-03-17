// scripts/generate-specs.ts

import { writeFileSync } from 'fs'
import { globSync } from 'glob'
import { resolve, basename } from 'path'
import { buildSpecMd, buildDependencyGraphMd, type DependencyGraph, type SpecNode, type SpecEdge } from './spec-tools'

function isSpec(value: unknown): boolean {
    return (
        value !== null &&
        typeof value === 'object' &&
        'shouldSucceedWith' in value &&
        'shouldAssert' in value
    )
}

async function main() {
    const specFiles = globSync('src/domain/**/*.spec.ts')

    if (specFiles.length === 0) {
        console.log('No .spec.ts files found.')
        return
    }

    // -- Pass 1: import all modules, build graph nodes ------------------------

    const graph: DependencyGraph = { nodes: new Map() }
    const modules: Array<{ file: string; mod: any }> = []

    for (const file of specFiles) {
        const resolvedPath = resolve(file)
        const mod = await import(resolvedPath)
        modules.push({ file, mod })

        const mdPath = resolvedPath.replace(/\.spec\.ts$/, '.spec.md')
        const name = basename(file, '.spec.ts')

        for (const value of Object.values(mod)) {
            if (isSpec(value)) {
                const node: SpecNode = {
                    name,
                    specPath: mdPath,
                    spec: value as object,
                    edges: [],
                }
                graph.nodes.set(value as object, node)
            }
        }
    }

    // -- Pass 2: resolve edges ------------------------------------------------

    for (const node of graph.nodes.values()) {
        const spec = node.spec as any
        if (!spec.steps) continue

        for (const step of spec.steps) {
            const edge: SpecEdge = {
                stepName: step.name,
                type: step.type,
                target: null,
            }

            if ((step.type === 'step' || step.type === 'safe-dep') && step.spec) {
                edge.target = graph.nodes.get(step.spec) ?? null
            }

            node.edges.push(edge)
        }
    }

    // -- Pass 3: generate .spec.md files --------------------------------------

    let generated = 0
    const writtenPaths = new Set<string>()

    for (const { file, mod } of modules) {
        const resolvedPath = resolve(file)
        const mdPath = resolvedPath.replace(/\.spec\.ts$/, '.spec.md')
        if (writtenPaths.has(mdPath)) continue

        const specs = Object.entries(mod).filter(([_, v]) => isSpec(v))
        if (specs.length === 0) continue

        // Pick primary: prefer document:true, then has steps, then first
        const primary = specs.find(([_, v]) => (v as any).document === true)
            ?? specs.find(([_, v]) => (v as any).steps)
            ?? specs[0]

        const [exportName, value] = primary
        const name = basename(file, '.spec.ts')
        const content = buildSpecMd(name, value, graph, mdPath)
        writeFileSync(mdPath, content)
        writtenPaths.add(mdPath)
        console.log(`  ${name} (${exportName}): wrote ${mdPath}`)
        generated++
    }

    // -- Pass 4: generate dependency graph ------------------------------------

    const graphMd = buildDependencyGraphMd(graph)
    const graphPath = resolve('docs/dependency-graph.md')
    writeFileSync(graphPath, graphMd)
    console.log(`  dependency-graph: wrote ${graphPath}`)

    if (generated === 0) {
        console.log('No spec exports found — nothing to generate.')
    } else {
        console.log(`\nGenerated ${generated} .spec.md file(s) + dependency graph.`)
    }
}

main().catch(err => {
    console.error('generate-specs failed:', err)
    process.exit(1)
})
