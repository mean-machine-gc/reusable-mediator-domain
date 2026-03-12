// compose-results step
import type { Result } from '../../../shared/spec'

export type ComposeResultsInput = { results: boolean[]; logic: 'and' | 'or' }
export type ComposeResultsOutput = boolean
export type ComposeResultsFailure = never
export type ComposeResultsSuccess = 'results-composed'

export const composeResults = (input: ComposeResultsInput): Result<ComposeResultsOutput, ComposeResultsFailure, ComposeResultsSuccess> => {
  const value = input.logic === 'and'
    ? input.results.every(Boolean)
    : input.results.some(Boolean)

  return { ok: true, value, successType: ['results-composed'] }
}
