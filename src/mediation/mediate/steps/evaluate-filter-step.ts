// evaluate-filter-step step factory
import type { CloudEvent } from 'cloudevents'
import type { Result } from '../../../shared/spec'
import type { FilterRules, FilterCondition } from '../../types'

// ── Types ──────────────────────────────────────────────────────────────────────

export type EvaluateFilterStepInput = { event: CloudEvent; rules: FilterRules }
export type EvaluateFilterStepOutput = boolean
export type EvaluateFilterStepFailure = ResolveFieldFailure | EvaluateConditionFailure | ComposeResultsFailure
export type EvaluateFilterStepSuccess = 'filter-matched' | 'filter-rejected'

export type ResolveFieldFailure = string // TBD
export type ResolveFieldSuccess = 'field-resolved'

export type EvaluateConditionFailure = string // TBD
export type EvaluateConditionSuccess = 'condition-evaluated'

export type ComposeResultsFailure = string // TBD
export type ComposeResultsSuccess = 'results-composed'

// ── Steps ──────────────────────────────────────────────────────────────────────

type Steps = {
  resolveField: (input: {
    event: CloudEvent
    path: string
  }) => Result<unknown, ResolveFieldFailure, ResolveFieldSuccess>

  evaluateCondition: Record<
    FilterCondition['operator'],
    (input: {
      fieldValue: unknown
      condition: FilterCondition
    }) => Result<boolean, EvaluateConditionFailure, EvaluateConditionSuccess>
  >

  composeResults: (input: {
    results: boolean[]
    logic: 'and' | 'or'
  }) => Result<boolean, ComposeResultsFailure, ComposeResultsSuccess>
}

// ── Factory ────────────────────────────────────────────────────────────────────

export const evaluateFilterStepFactory =
  (steps: Steps) =>
  (input: EvaluateFilterStepInput): Result<EvaluateFilterStepOutput, EvaluateFilterStepFailure, EvaluateFilterStepSuccess> => {
    // 1. evaluate each condition
    const results: boolean[] = []
    for (const condition of input.rules.conditions) {
      // 1a. resolve the field value from the event
      const fieldValue = steps.resolveField({ event: input.event, path: condition.field })
      if (!fieldValue.ok) return fieldValue as unknown as Result<EvaluateFilterStepOutput, EvaluateFilterStepFailure, EvaluateFilterStepSuccess>

      // 1b. evaluate the condition against the resolved value
      const evaluation = steps.evaluateCondition[condition.operator]({ fieldValue: fieldValue.value, condition })
      if (!evaluation.ok) return evaluation as unknown as Result<EvaluateFilterStepOutput, EvaluateFilterStepFailure, EvaluateFilterStepSuccess>

      results.push(evaluation.value)
    }

    // 2. compose results with and/or logic
    const composed = steps.composeResults({ results, logic: input.rules.logic })
    if (!composed.ok) return composed as unknown as Result<EvaluateFilterStepOutput, EvaluateFilterStepFailure, EvaluateFilterStepSuccess>

    // 3. return match result with appropriate success type
    const successType: EvaluateFilterStepSuccess = composed.value ? 'filter-matched' : 'filter-rejected'
    return { ok: true, value: composed.value, successType: [successType] }
  }
