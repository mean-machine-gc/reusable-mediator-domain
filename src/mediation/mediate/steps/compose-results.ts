// compose-results step
import type { ComposeResultsFn } from './compose-results.spec'

export const composeResults: ComposeResultsFn['signature'] = (input) => {
  const value = input.logic === 'and'
    ? input.results.every(Boolean)
    : input.results.some(Boolean)

  return { ok: true, value, successType: ['results-composed'] }
}
