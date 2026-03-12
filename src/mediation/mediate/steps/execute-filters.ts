// execute-filters step factory
import type { CloudEvent } from 'cloudevents'
import type { Result } from '../../../shared/spec'
import type { FilterStep, FilterRules } from '../../types'

// ── Types ──────────────────────────────────────────────────────────────────────

export type ExecuteFiltersInput = { event: CloudEvent; filters: FilterStep[] }
export type ExecuteFiltersOutput = CloudEvent
export type ExecuteFiltersFailure = EvaluateFilterStepFailure
export type ExecuteFiltersSuccess = 'filters-passed' | 'event-skipped'

export type EvaluateFilterStepFailure = string // TBD — will narrow when step is specced
export type EvaluateFilterStepSuccess = 'filter-matched' | 'filter-rejected'

// ── Steps ──────────────────────────────────────────────────────────────────────

type Steps = {
  evaluateFilterStep: (input: {
    event: CloudEvent
    rules: FilterRules
  }) => Result<boolean, EvaluateFilterStepFailure, EvaluateFilterStepSuccess>
}

// ── Factory ────────────────────────────────────────────────────────────────────

export const executeFiltersFactory =
  (steps: Steps) =>
  (input: ExecuteFiltersInput): Result<ExecuteFiltersOutput, ExecuteFiltersFailure, ExecuteFiltersSuccess> => {
    // 1. iterate over filter steps — if any rejects, return event-skipped
    for (const filter of input.filters) {
      const result = steps.evaluateFilterStep({ event: input.event, rules: filter.rules })
      if (!result.ok) return result as unknown as Result<ExecuteFiltersOutput, ExecuteFiltersFailure, ExecuteFiltersSuccess>
      if (result.successType?.includes('filter-rejected'))
        return { ok: true, value: input.event, successType: ['event-skipped'] }
    }

    // 2. all filters passed
    return { ok: true, value: input.event, successType: ['filters-passed'] }
  }
