// scripts/spec-tools.ts

// ── Types ────────────────────────────────────────────────────────────────────

export type FlatConstraint = {
  step:    string    // 'parseCartId', 'checkActive', 'findCartById'
  failure: string    // 'not_a_string', 'cart_empty', 'find_failed'
  type:    'step' | 'dep'
}

export type FlatTable = {
  columns:   FlatConstraint[]
  successes: string[]
}

// ── flattenSpec ──────────────────────────────────────────────────────────────
// Recursively walks factory spec tree, collecting constraints in pipeline order.

export function flattenSpec(spec: any): FlatTable {
  return {
    columns:   flattenConstraints(spec),
    successes: Object.keys(spec.successes),
  }
}

function flattenConstraints(spec: any): FlatConstraint[] {
  const result: FlatConstraint[] = []

  for (const [name, stepSpec] of Object.entries(spec.steps || {}) as any[]) {
    if (stepSpec.steps) {
      // Recursive — this step is itself a factory (e.g. core inside shell)
      result.push(...flattenConstraints(stepSpec))
    } else {
      for (const failure of Object.keys(stepSpec.constraints || {})) {
        result.push({ step: name, failure, type: 'step' })
      }
    }
  }

  for (const [name, depSpec] of Object.entries(spec.deps || {}) as any[]) {
    for (const failure of depSpec.failures) {
      result.push({ step: name, failure, type: 'dep' })
    }
  }

  return result
}

// ── toMarkdownTable ──────────────────────────────────────────────────────────
// Converts flat table to decision table markdown with ✓/✗/— symbols.

export function toMarkdownTable(table: FlatTable): string {
  const { columns, successes } = table

  const header = [
    'Scenario',
    ...columns.map(c => `\`${c.step}\` :${c.failure}`),
    'Outcome',
  ]
  const separator = ['---', ...columns.map(() => ':---:'), '---']

  const successRows = successes.map(s => [
    `✅ ${s}`,
    ...columns.map(() => '✓'),
    s,
  ])

  const failureRows = columns.map((c, i) => [
    `❌ ${c.failure}`,
    ...columns.map((_, j) => j < i ? '✓' : j === i ? '✗' : '—'),
    `Fails: \`${c.failure}\``,
  ])

  const rows = [header, separator, ...successRows, ...failureRows]
  return rows.map(r => `| ${r.join(' | ')} |`).join('\n')
}

// ── toStepTable ──────────────────────────────────────────────────────────────
// Extracts pipeline step table from a factory spec (for §4 and §5 of .spec.md).

export function toStepTable(spec: any): string {
  const rows: string[][] = [
    ['#', 'Name', 'Type', 'Failure Codes'],
    ['---', '---', '---', '---'],
  ]
  let index = 1

  for (const [name, stepSpec] of Object.entries(spec.steps || {}) as any[]) {
    const failures = stepSpec.steps
      ? flattenConstraints(stepSpec).map(c => c.failure)
      : Object.keys(stepSpec.constraints || {})
    const failStr = failures.length > 0 ? failures.map(f => `\`${f}\``).join(', ') : '—'
    rows.push([String(index++), `\`${name}\``, '`STEP`', failStr])
  }

  for (const [name, depSpec] of Object.entries(spec.deps || {}) as any[]) {
    const failStr = depSpec.failures.map((f: string) => `\`${f}\``).join(', ') || '—'
    rows.push([String(index++), `\`${name}\``, '`DEP`', failStr])
  }

  return rows.map(r => `| ${r.join(' | ')} |`).join('\n')
}
