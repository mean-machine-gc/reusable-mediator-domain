// delete-mediation shell factory
import type { Result } from '../../shared/spec'
import type { MediationId, Mediation, DraftMediation, DeactivatedMediation } from '../types'
import type { ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps } from './delete-mediation.spec'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './core/delete-mediation.spec'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { deleteMediationCoreFactory, coreSteps } from './core/delete-mediation'

type ShellSteps = {
  parseMediationId: (input: unknown) => Result<MediationId>
  deleteMediationCore: (input: CoreInput) => Result<CoreOutput, CoreFailure, CoreSuccess>
}

export const shellSteps: ShellSteps = {
  parseMediationId,
  deleteMediationCore: deleteMediationCoreFactory(coreSteps),
}

export const deleteMediationShellFactory =
  (steps: ShellSteps) =>
  (deps: Deps) =>
  async (input: ShellInput): Promise<Result<ShellOutput, ShellFailure, ShellSuccess>> => {
    // 1. parse mediation ID from command
    const mediationId = steps.parseMediationId(input.cmd.mediationId)
    if (!mediationId.ok) return mediationId as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 2. find mediation (dep)
    const mediation = await deps.findMediation(mediationId.value)
    if (!mediation.ok) return mediation as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 3. delete mediation core (step — guards state)
    const checked = steps.deleteMediationCore({
      cmd: input.cmd,
      state: mediation.value,
    })
    if (!checked.ok) return checked as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 4. delete mediation (dep)
    const deleted = await deps.deleteMediation(checked.value)
    if (!deleted.ok) return deleted as Result<ShellOutput, ShellFailure, ShellSuccess>

    return { ok: true, value: deleted.value, successType: checked.successType }
  }
