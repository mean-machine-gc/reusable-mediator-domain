// resolve-field step
import type { ResolveFieldFn } from './resolve-field.spec'

export const resolveField: ResolveFieldFn['signature'] = (input) => {
  const segments = input.path.split('.')
  let current: unknown = input.event

  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== 'object')
      return { ok: true, value: undefined, successType: ['field-resolved'] }
    current = (current as Record<string, unknown>)[segment]
  }

  return { ok: true, value: current, successType: ['field-resolved'] }
}
