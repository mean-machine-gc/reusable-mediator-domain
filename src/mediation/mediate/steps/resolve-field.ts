// resolve-field step
import type { CloudEvent } from 'cloudevents'
import type { Result } from '../../../shared/spec'

export type ResolveFieldInput = { event: CloudEvent; path: string }
export type ResolveFieldOutput = unknown
export type ResolveFieldFailure = 'invalid_path'
export type ResolveFieldSuccess = 'field-resolved'

export const resolveField = (input: ResolveFieldInput): Result<ResolveFieldOutput, ResolveFieldFailure, ResolveFieldSuccess> => {
  const segments = input.path.split('.')
  let current: unknown = input.event

  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== 'object')
      return { ok: true, value: undefined, successType: ['field-resolved'] }
    current = (current as Record<string, unknown>)[segment]
  }

  return { ok: true, value: current, successType: ['field-resolved'] }
}
