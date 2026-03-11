// parse-destination.ts
import type { Result } from '../../../shared/spec'
import type { Destination } from '../../types'
import type { ParseDestinationFailure, ParseDestinationSuccess } from './parse-destination.spec'
import { parseDestinationSpec } from './parse-destination.spec'

export const parseDestination = (input: unknown): Result<Destination, ParseDestinationFailure, ParseDestinationSuccess> => {
  if (typeof input !== 'string')
    return { ok: false, errors: ['not_a_string'] }

  const errors: ParseDestinationFailure[] = []

  for (const [failure, constraint] of Object.entries(parseDestinationSpec.constraints)) {
    if (failure === 'not_a_string') continue
    if (!constraint.predicate({ input })) errors.push(failure as ParseDestinationFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as Destination, successType: ['destination-parsed'] }
}
