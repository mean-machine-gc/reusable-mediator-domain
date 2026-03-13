import { z } from 'zod'
import type { Cmd } from '../../../shared/spec-framework'
import { MediationId } from '../../types'

export const commandType = 'activateMediation' as const
export const ActivateMediationCommand = z.object({
    mediationId: MediationId,
})
export type ActivateMediationCommand = z.infer<typeof ActivateMediationCommand>
export type ActivateMediationCmd = Cmd<typeof commandType, ActivateMediationCommand>
