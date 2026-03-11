// update-pipeline core factory
import type { Result } from '../../../shared/spec'
import type { Mediation, DraftMediation, DeactivatedMediation, Pipeline } from '../../types'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './update-pipeline.spec'
import { checkUpdatableState } from '../../shared/steps/check-updatable-state'
import { applyPipeline } from '../../shared/steps/apply-pipeline'

type CoreSteps = {
  checkUpdatableState: (input: Mediation) => Result<DraftMediation | DeactivatedMediation>
  applyPipeline: (input: {
    state: DraftMediation | DeactivatedMediation
    pipeline: Pipeline
  }) => Result<DraftMediation | DeactivatedMediation>
}

export const coreSteps: CoreSteps = {
  checkUpdatableState,
  applyPipeline,
}

export const updatePipelineCoreFactory =
  (steps: CoreSteps) =>
  (input: CoreInput): Result<CoreOutput, CoreFailure, CoreSuccess> => {
    // 1. check updatable state (must be draft or deactivated)
    const checked = steps.checkUpdatableState(input.state)
    if (!checked.ok) return checked as Result<CoreOutput, CoreFailure, CoreSuccess>

    // 2. apply new pipeline
    const updated = steps.applyPipeline({
      state: checked.value,
      pipeline: input.cmd.pipeline,
    })
    if (!updated.ok) return updated as Result<CoreOutput, CoreFailure, CoreSuccess>

    return { ok: true, value: updated.value, successType: ['pipeline-updated'] }
  }
