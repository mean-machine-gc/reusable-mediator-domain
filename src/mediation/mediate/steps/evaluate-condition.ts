// evaluate-condition strategy step
import type { EvaluateConditionStrategyFn } from './evaluate-condition.spec'
import type { Result } from '../../../shared/spec-framework'

const ok = (value: boolean): Result<boolean, never, 'condition-evaluated'> =>
  ({ ok: true, value, successType: ['condition-evaluated'] })

export const evaluateCondition: EvaluateConditionStrategyFn['handlers'] = {
  // Equality
  equals:     ({ fieldValue, condition }) => ok(fieldValue === (condition as { value: unknown }).value),
  not_equals: ({ fieldValue, condition }) => ok(fieldValue !== (condition as { value: unknown }).value),

  // Presence
  exists:     ({ fieldValue }) => ok(fieldValue !== undefined),
  not_exists: ({ fieldValue }) => ok(fieldValue === undefined),

  // String
  contains:    ({ fieldValue, condition }) => ok(typeof fieldValue === 'string' && fieldValue.includes((condition as { value: string }).value)),
  starts_with: ({ fieldValue, condition }) => ok(typeof fieldValue === 'string' && fieldValue.startsWith((condition as { value: string }).value)),
  ends_with:   ({ fieldValue, condition }) => ok(typeof fieldValue === 'string' && fieldValue.endsWith((condition as { value: string }).value)),
  regex:       ({ fieldValue, condition }) => ok(typeof fieldValue === 'string' && new RegExp((condition as { pattern: string }).pattern).test(fieldValue)),

  // Comparison
  greater_than:          ({ fieldValue, condition }) => ok(typeof fieldValue === 'number' && fieldValue > (condition as { value: number }).value),
  less_than:             ({ fieldValue, condition }) => ok(typeof fieldValue === 'number' && fieldValue < (condition as { value: number }).value),
  greater_than_or_equal: ({ fieldValue, condition }) => ok(typeof fieldValue === 'number' && fieldValue >= (condition as { value: number }).value),
  less_than_or_equal:    ({ fieldValue, condition }) => ok(typeof fieldValue === 'number' && fieldValue <= (condition as { value: number }).value),

  // Collection
  in:     ({ fieldValue, condition }) => ok((condition as { values: unknown[] }).values.includes(fieldValue)),
  not_in: ({ fieldValue, condition }) => ok(!(condition as { values: unknown[] }).values.includes(fieldValue)),
}
