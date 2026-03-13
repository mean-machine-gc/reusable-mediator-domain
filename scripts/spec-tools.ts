// scripts/spec-tools.ts

// =============================================================================
// Spec Tools — flatten specs into decision tables
// Strategy-aware: produces main table (linear) + per-handler sub-tables.
// =============================================================================

import type { Spec, StepInfo, StrategyStep } from '../src/shared/spec-framework'

// -- Types --------------------------------------------------------------------

export type FlatConstraint = {
    step: string
    failure: string
    type: 'step' | 'safe-dep' | 'dep' | 'strategy'
}

export type StrategyTable = {
    stepName: string
    caseName: string
    columns: FlatConstraint[]
    successes: string[]
}

export type FlatTable = {
    columns: FlatConstraint[]     // linear constraints only (no strategy handler details)
    successes: string[]
    strategies: StrategyTable[]   // one sub-table per handler
}

// -- flattenSpec --------------------------------------------------------------

export function flattenSpec(spec: any): FlatTable {
    const columns: FlatConstraint[] = []
    const strategies: StrategyTable[] = []

    if (spec.steps) {
        for (const step of spec.steps as StepInfo[]) {
            switch (step.type) {
                case 'step':
                case 'safe-dep':
                    if (step.spec) {
                        const stepColumns = flattenAtomicSpec(step.name, step.spec)
                        columns.push(...stepColumns.map(c => ({ ...c, type: step.type as FlatConstraint['type'] })))
                    } else {
                        columns.push({ step: step.name, failure: `(${step.name})`, type: step.type })
                    }
                    break

                case 'dep':
                    columns.push({ step: step.name, failure: `(${step.name})`, type: 'dep' })
                    break

                case 'strategy':
                    // Strategy appears as a single column in the main table
                    columns.push({ step: step.name, failure: `(${step.name})`, type: 'strategy' })

                    // Each handler gets its own sub-table
                    for (const [caseName, handlerSpec] of Object.entries(step.handlers)) {
                        const handlerColumns = flattenAtomicSpec(`${step.name}`, handlerSpec as any)
                        const handlerSuccesses = Object.keys((handlerSpec as any).shouldSucceedWith || {})
                        strategies.push({
                            stepName: step.name,
                            caseName,
                            columns: handlerColumns,
                            successes: handlerSuccesses,
                        })
                    }
                    break
            }
        }
    } else {
        // Atomic spec — collect directly from shouldFailWith
        for (const failure of Object.keys(spec.shouldFailWith || {})) {
            columns.push({ step: '(self)', failure, type: 'step' })
        }
    }

    // Own failures not inherited from steps — insert at the end of the linear columns
    // These are typically dep failures or factory-level validations
    const inheritedKeys = new Set(columns.map(c => c.failure))
    for (const [failure, group] of Object.entries(spec.shouldFailWith || {}) as any[]) {
        if (group && !inheritedKeys.has(failure)) {
            // Use coveredBy if available to attribute the failure to a step
            const stepName = group.coveredBy || '(own)'
            columns.push({ step: stepName, failure, type: 'step' })
        }
    }

    return {
        columns,
        successes: Object.keys(spec.shouldSucceedWith),
        strategies,
    }
}

function flattenAtomicSpec(stepName: string, spec: any): FlatConstraint[] {
    const result: FlatConstraint[] = []

    if (spec.steps) {
        // Composed spec — recurse
        for (const step of spec.steps as StepInfo[]) {
            if ((step.type === 'step' || step.type === 'safe-dep') && step.spec) {
                const nested = flattenAtomicSpec(step.name, step.spec)
                for (const entry of nested) {
                    result.push({ ...entry, step: `${stepName}.${entry.step}` })
                }
            }
        }
    } else {
        // Atomic — collect from shouldFailWith
        for (const failure of Object.keys(spec.shouldFailWith || {})) {
            result.push({ step: stepName, failure, type: 'step' })
        }
    }

    return result
}

// -- toMainTable --------------------------------------------------------------
// Linear pipeline table. Strategy steps appear as a single column (pass/fail).
// Strategy handler constraints are NOT shown here — they're in sub-tables.

export function toMainTable(table: FlatTable): string {
    const { columns, successes, strategies } = table

    const realColumns = columns.filter(c => !c.failure.startsWith('(') || c.type === 'strategy')

    const header = [
        'Scenario',
        ...realColumns.map(c =>
            c.type === 'strategy'
                ? `\`${c.step}\` _(strategy)_`
                : `\`${c.step}\` :${c.failure}`
        ),
        'Outcome',
    ]
    const separator = ['---', ...realColumns.map(() => ':---:'), '---']

    const successRows = successes.map(s => [
        `OK ${s}`,
        ...realColumns.map(c =>
            c.type === 'strategy'
                ? `pass _(${findHandlerForSuccess(strategies, c.step, s)})_`
                : 'pass'
        ),
        s,
    ])

    const failureRows = realColumns
        .filter(c => c.type !== 'strategy')
        .map((c, _i) => {
            const colIndex = realColumns.indexOf(c)
            return [
                `FAIL ${c.failure}`,
                ...realColumns.map((_, j) =>
                    j < colIndex ? 'pass' : j === colIndex ? 'FAIL' : '--'
                ),
                `Fails: \`${c.failure}\``,
            ]
        })

    // Strategy note rows
    const strategyNoteRows = strategies.length > 0
        ? [[
            `_strategy_`,
            ...realColumns.map(() => ''),
            `_See handler tables below_`,
        ]]
        : []

    const rows = [header, separator, ...successRows, ...failureRows, ...strategyNoteRows]
    return rows.map(r => `| ${r.join(' | ')} |`).join('\n')
}

function findHandlerForSuccess(strategies: StrategyTable[], stepName: string, success: string): string {
    for (const s of strategies) {
        if (s.stepName === stepName && s.successes.includes(success)) {
            return s.caseName
        }
    }
    return '?'
}

// -- toHandlerTables ----------------------------------------------------------
// One table per strategy handler. Shows the handler's own constraints.

export function toHandlerTables(table: FlatTable): string {
    if (table.strategies.length === 0) return ''

    const sections: string[] = []

    // Group by strategy step name
    const byStep = new Map<string, StrategyTable[]>()
    for (const s of table.strategies) {
        const list = byStep.get(s.stepName) || []
        list.push(s)
        byStep.set(s.stepName, list)
    }

    for (const [stepName, handlers] of byStep) {
        sections.push(`### Strategy: \`${stepName}\`\n`)

        for (const handler of handlers) {
            sections.push(`#### Handler: \`${handler.caseName}\`\n`)

            if (handler.columns.length === 0) {
                sections.push('_No constraints — handler always succeeds._\n')
                continue
            }

            const header = [
                'Scenario',
                ...handler.columns.map(c => `\`${c.step}\` :${c.failure}`),
                'Outcome',
            ]
            const separator = ['---', ...handler.columns.map(() => ':---:'), '---']

            const successRows = handler.successes.map(s => [
                `OK ${s}`,
                ...handler.columns.map(() => 'pass'),
                s,
            ])

            const failureRows = handler.columns.map((c, i) => [
                `FAIL ${c.failure}`,
                ...handler.columns.map((_, j) => j < i ? 'pass' : j === i ? 'FAIL' : '--'),
                `Fails: \`${c.failure}\``,
            ])

            const rows = [header, separator, ...successRows, ...failureRows]
            sections.push(rows.map(r => `| ${r.join(' | ')} |`).join('\n'))
            sections.push('')
        }
    }

    return sections.join('\n')
}

// -- toStepTable --------------------------------------------------------------

export function toStepTable(spec: any): string {
    if (!spec.steps) return '_Atomic function — no pipeline steps._'

    const rows: string[][] = [
        ['#', 'Name', 'Type', 'Description', 'Failure Codes'],
        ['---', '---', '---', '---', '---'],
    ]

    for (let i = 0; i < spec.steps.length; i++) {
        const step = spec.steps[i]
        let failures: string[] = []
        let typeStr: string

        switch (step.type) {
            case 'step':
                typeStr = '`STEP`'
                if (step.spec) {
                    failures = Object.keys(step.spec.shouldFailWith || {})
                }
                break
            case 'safe-dep':
                typeStr = '`SAFE-DEP`'
                if (step.spec) {
                    failures = Object.keys(step.spec.shouldFailWith || {})
                }
                break
            case 'dep':
                typeStr = '`DEP`'
                break
            case 'strategy':
                typeStr = '`STRATEGY`'
                // Collect failures from all handlers
                if (step.handlers) {
                    for (const [caseName, handlerSpec] of Object.entries(step.handlers) as any[]) {
                        const handlerFailures = Object.keys(handlerSpec.shouldFailWith || {})
                        failures.push(...handlerFailures.map(f => `${f} _(${caseName})_`))
                    }
                }
                break
        }

        const failStr = failures.length > 0
            ? failures.map(f => f.startsWith('`') ? f : `\`${f}\``).join(', ')
            : '--'

        rows.push([String(i + 1), `\`${step.name}\``, typeStr!, step.description, failStr])
    }

    return rows.map(r => `| ${r.join(' | ')} |`).join('\n')
}

// -- buildSpecMd --------------------------------------------------------------
// Assembles the full .spec.md with strategy-aware tables.

export function buildSpecMd(name: string, spec: any): string {
    const pipeline = toStepTable(spec)
    const table = flattenSpec(spec)
    const main = toMainTable(table)
    const handlers = toHandlerTables(table)

    const parts = [
        `# ${name}`,
        '',
        `> Auto-generated from \`${name}.spec.ts\`. Do not edit — run \`npm run gen:specs\` to regenerate.`,
        `> For business-friendly documentation, see \`/docs/\`.`,
        '',
        '---',
        '',
        '## Pipeline',
        '',
        pipeline,
        '',
        '---',
        '',
        '## Decision Table',
        '',
        main,
    ]

    if (handlers) {
        parts.push('', '---', '', handlers)
    }

    return parts.join('\n') + '\n'
}
