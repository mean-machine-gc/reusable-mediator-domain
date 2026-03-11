// deactivate-mediation shell factory
import type { Result } from '../../shared/spec'
import type { MediationId, Mediation, ActiveMediation, DeactivatedMediation, DeactivatedAt } from '../types'
import type { ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps } from './deactivate-mediation.spec'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './core/deactivate-mediation.spec'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { deactivateMediationCoreFactory, coreSteps } from './core/deactivate-mediation'

type ShellSteps = {
  parseMediationId: (input: unknown) => Result<MediationId>
  deactivateMediationCore: (input: CoreInput) => Result<CoreOutput, CoreFailure, CoreSuccess>
}

export const shellSteps: ShellSteps = {
  parseMediationId,
  deactivateMediationCore: deactivateMediationCoreFactory(coreSteps),
}

export const deactivateMediationShellFactory =
  (steps: ShellSteps) =>
  (deps: Deps) =>
  async (input: ShellInput): Promise<Result<ShellOutput, ShellFailure, ShellSuccess>> => {
    // 1. parse mediation ID from command
    const mediationId = steps.parseMediationId(input.cmd.mediationId)
    if (!mediationId.ok) return mediationId as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 2. find mediation (dep)
    const mediation = await deps.findMediation(mediationId.value)
    if (!mediation.ok) return mediation as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 3. generate timestamp (dep)
    const timestamp = await deps.generateTimestamp()
    if (!timestamp.ok) return timestamp as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 4. deactivate mediation core (step)
    const deactivated = steps.deactivateMediationCore({
      cmd: input.cmd,
      state: mediation.value,
      ctx: { deactivatedAt: timestamp.value },
    })
    if (!deactivated.ok) return deactivated as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 5. save mediation (dep)
    const saved = await deps.saveMediation(deactivated.value)
    if (!saved.ok) return saved as Result<ShellOutput, ShellFailure, ShellSuccess>

    return { ok: true, value: saved.value, successType: deactivated.successType }
  }
