import { Type, Static } from '@sinclair/typebox'
import type { Cmd } from '../../../shared/spec-framework'
import { Topic, Destination, Pipeline } from '../../schemas'

export const commandType = 'createMediation' as const
export type CreateMediationCommand = Static<typeof CreateMediationCommand>
export const CreateMediationCommand = Type.Object({
    topic: Topic,
    destination: Destination,
    pipeline: Pipeline,
})
export type CreateMediationCmd = Cmd<typeof commandType, CreateMediationCommand>
