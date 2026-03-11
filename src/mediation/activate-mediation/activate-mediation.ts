// activate-mediation shell factory
import type { Result } from '../../shared/spec'
import type { MediationId, Mediation, ActiveMediation, ActivatedAt } from '../types'
import type { ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps } from './activate-mediation.spec'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './core/activate-mediation.spec'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { activateMediationCoreFactory, coreSteps } from './core/activate-mediation'

type ShellSteps = {
  parseMediationId: (input: unknown) => Result<MediationId>
  activateMediationCore: (input: CoreInput) => Result<CoreOutput, CoreFailure, CoreSuccess>
}

export const shellSteps: ShellSteps = {
  parseMediationId,
  activateMediationCore: activateMediationCoreFactory(coreSteps),
}

export const activateMediationShellFactory =
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

    // 4. activate mediation core (step)
    const activated = steps.activateMediationCore({
      cmd: input.cmd,
      state: mediation.value,
      ctx: { activatedAt: timestamp.value },
    })
    if (!activated.ok) return activated as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 5. save mediation (dep)
    const saved = await deps.saveMediation(activated.value)
    if (!saved.ok) return saved as Result<ShellOutput, ShellFailure, ShellSuccess>

    return { ok: true, value: saved.value, successType: activated.successType }
  }
