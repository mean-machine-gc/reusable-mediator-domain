// parse-pipeline.ts
import type { Result } from '../../../shared/spec'
import type { Pipeline } from '../../types'
import type { ParsePipelineFailure, ParsePipelineSuccess } from './parse-pipeline.spec'
import { parsePipelineSpec } from './parse-pipeline.spec'

export const parsePipeline = (input: unknown): Result<Pipeline, ParsePipelineFailure, ParsePipelineSuccess> => {
  if (!Array.isArray(input))
    return { ok: false, errors: ['not_an_array'] }

  const errors: ParsePipelineFailure[] = []

  for (const [failure, constraint] of Object.entries(parsePipelineSpec.constraints)) {
    if (failure === 'not_an_array') continue
    if (!constraint.predicate({ input })) errors.push(failure as ParsePipelineFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as Pipeline, successType: ['pipeline-parsed'] }
}
