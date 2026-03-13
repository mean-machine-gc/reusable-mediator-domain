import { Type, Static } from '@sinclair/typebox'
import type { Cmd } from '../../../shared/spec-framework'
import { MediationId } from '../../schemas'

export const commandType = 'activateMediation' as const
export type ActivateMediationCommand = Static<typeof ActivateMediationCommand>
export const ActivateMediationCommand = Type.Object({
    mediationId: MediationId,
})
export type ActivateMediationCmd = Cmd<typeof commandType, ActivateMediationCommand>
