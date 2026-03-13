import { Type, Static } from '@sinclair/typebox'
import type { Cmd } from '../../../shared/spec-framework'
import { ProcessingId, CloudEvent } from '../../schemas'

export const commandType = 'receiveEvent' as const
export type ReceiveEventCommand = Static<typeof ReceiveEventCommand>
export const ReceiveEventCommand = Type.Object({
    processingId: ProcessingId,
    event: CloudEvent,
})
export type ReceiveEventCmd = Cmd<typeof commandType, ReceiveEventCommand>
