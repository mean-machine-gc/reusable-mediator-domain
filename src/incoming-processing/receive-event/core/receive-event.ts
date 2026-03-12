import type { ReceiveEventFn } from './receive-event.spec'

export const receiveEvent: ReceiveEventFn['signature'] = ({ cmd, state, ctx }) => {
    if (state !== null)
        return { ok: false, errors: ['already_exists'] }

    const errors: ReceiveEventFn['failures'][] = []

    const type = (cmd.event as any).type
    const dataschema = (cmd.event as any).dataschema

    if (!type) errors.push('missing_event_type')
    if (!dataschema) errors.push('missing_dataschema')

    if (errors.length > 0) return { ok: false, errors }

    return {
        ok: true,
        value: {
            status: 'received',
            id: cmd.processingId,
            event: cmd.event,
            topic: type,
            dataschemaUri: dataschema,
            receivedAt: ctx.receivedAt,
        },
        successType: ['event-received'],
    }
}
