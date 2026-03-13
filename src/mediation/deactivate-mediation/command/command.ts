import { Type, Static } from '@sinclair/typebox'
import type { Cmd } from '../../../shared/spec-framework'
import { MediationId } from '../../schemas'

export const commandType = 'deactivateMediation' as const
export type DeactivateMediationCommand = Static<typeof DeactivateMediationCommand>
export const DeactivateMediationCommand = Type.Object({
    mediationId: MediationId,
})
export type DeactivateMediationCmd = Cmd<typeof commandType, DeactivateMediationCommand>
