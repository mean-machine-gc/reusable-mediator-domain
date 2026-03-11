// update-pipeline shell factory
import type { Result } from '../../shared/spec'
import type { MediationId, Mediation, DraftMediation, DeactivatedMediation, Pipeline } from '../types'
import type { ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps } from './update-pipeline.spec'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './core/update-pipeline.spec'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { parsePipeline } from '../shared/steps/parse-pipeline'
import { updatePipelineCoreFactory, coreSteps } from './core/update-pipeline'

type ShellSteps = {
  parseMediationId: (input: unknown) => Result<MediationId>
  parsePipeline: (input: unknown) => Result<Pipeline>
  updatePipelineCore: (input: CoreInput) => Result<CoreOutput, CoreFailure, CoreSuccess>
}

export const shellSteps: ShellSteps = {
  parseMediationId,
  parsePipeline,
  updatePipelineCore: updatePipelineCoreFactory(coreSteps),
}

export const updatePipelineShellFactory =
  (steps: ShellSteps) =>
  (deps: Deps) =>
  async (input: ShellInput): Promise<Result<ShellOutput, ShellFailure, ShellSuccess>> => {
    // 1. parse mediation ID from command
    const mediationId = steps.parseMediationId(input.cmd.mediationId)
    if (!mediationId.ok) return mediationId as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 2. parse pipeline from command
    const pipeline = steps.parsePipeline(input.cmd.pipeline)
    if (!pipeline.ok) return pipeline as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 3. find mediation (dep)
    const mediation = await deps.findMediation(mediationId.value)
    if (!mediation.ok) return mediation as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 4. update pipeline core (step — guards state + applies pipeline)
    const updated = steps.updatePipelineCore({
      cmd: { pipeline: pipeline.value },
      state: mediation.value,
    })
    if (!updated.ok) return updated as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 5. save mediation (dep)
    const saved = await deps.saveMediation(updated.value)
    if (!saved.ok) return saved as Result<ShellOutput, ShellFailure, ShellSuccess>

    return { ok: true, value: saved.value, successType: updated.successType }
  }
