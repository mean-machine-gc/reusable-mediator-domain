// execute-transforms step
import type { CloudEvent } from 'cloudevents'
import type { Result } from '../../../shared/spec'
import type { TransformStep, TransformRegistry } from '../../types'

export type ExecuteTransformsInput = { event: CloudEvent; transforms: TransformStep[]; registry: TransformRegistry }
export type ExecuteTransformsOutput = CloudEvent
export type ExecuteTransformsFailure = 'unknown_transform'
export type ExecuteTransformsSuccess = 'transforms-applied'

export const executeTransforms = (
  input: ExecuteTransformsInput,
): Result<ExecuteTransformsOutput, ExecuteTransformsFailure, ExecuteTransformsSuccess> => {
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
