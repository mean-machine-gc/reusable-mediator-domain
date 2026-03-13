import { z } from 'zod'
import type { Cmd } from '../../../shared/spec-framework'
import { MediationId } from '../../types'

export const commandType = 'deactivateMediation' as const
export const DeactivateMediationCommand = z.object({
    mediationId: MediationId,
})
export type DeactivateMediationCommand = z.infer<typeof DeactivateMediationCommand>
export type DeactivateMediationCmd = Cmd<typeof commandType, DeactivateMediationCommand>
