// apply-pipeline.ts
import type { Result } from '../../../shared/spec'
import type { DraftMediation, DeactivatedMediation } from '../../types'
import type { ApplyPipelineFailure, ApplyPipelineSuccess, ApplyPipelineInput } from './apply-pipeline.spec'

export const applyPipeline = (
  input: ApplyPipelineInput,
): Result<DraftMediation | DeactivatedMediation, ApplyPipelineFailure, ApplyPipelineSuccess> => {
  return {
    ok: true,
    value: { ...input.state, pipeline: input.pipeline },
    successType: ['pipeline-applied'],
  }
}
