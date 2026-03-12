// execute-transforms step
import type { ExecuteTransformsFn } from './execute-transforms.spec'

export const executeTransforms: ExecuteTransformsFn['signature'] = (input) => {
  let event = input.event

  for (const step of input.transforms) {
    for (const name of step.rules) {
      const fn = input.registry[name]
      if (!fn) return { ok: false, errors: ['unknown_transform'] }
      event = fn(event)
    }
  }

  return { ok: true, value: event, successType: ['transforms-applied'] }
}
