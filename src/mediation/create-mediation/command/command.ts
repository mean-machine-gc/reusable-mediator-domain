import { z } from 'zod'
import type { Cmd } from '../../../shared/spec-framework'
import { Topic, Destination, Pipeline } from '../../types'

export const commandType = 'createMediation' as const
export const CreateMediationCommand = z.object({
    topic: Topic,
    destination: Destination,
    pipeline: Pipeline,
})
export type CreateMediationCommand = z.infer<typeof CreateMediationCommand>
export type CreateMediationCmd = Cmd<typeof commandType, CreateMediationCommand>
