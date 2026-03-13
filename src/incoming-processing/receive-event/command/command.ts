import { z } from 'zod'
import type { CloudEvent } from 'cloudevents'
import type { Cmd } from '../../../shared/spec-framework'
import { ProcessingId } from '../../types'

export const commandType = 'receiveEvent' as const
export const ReceiveEventCommand = z.object({
    processingId: ProcessingId,
    event: z.record(z.string(), z.unknown()),
})
export type ReceiveEventCommand = z.infer<typeof ReceiveEventCommand>
export type ReceiveEventCmd = Cmd<typeof commandType, ReceiveEventCommand>
