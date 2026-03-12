// execute-filters step factory
import type { ExecuteFiltersFn } from './execute-filters.spec'
import { evaluateFilterStep } from './evaluate-filter-step'

type Steps = {
    evaluateFilterStep: typeof evaluateFilterStep
}

const executeFiltersFactory =
    (steps: Steps): ExecuteFiltersFn['signature'] =>
    (input) => {
        for (const filter of input.filters) {
            const result = steps.evaluateFilterStep({ event: input.event, rules: filter.rules })
            if (!result.ok) return result as any
            if (result.successType?.includes('filter-rejected'))
                return { ok: true, value: input.event, successType: ['event-skipped'] }
        }
        return { ok: true, value: input.event, successType: ['filters-passed'] }
    }

const filterSteps: Steps = { evaluateFilterStep }
export const executeFilters = executeFiltersFactory(filterSteps)
