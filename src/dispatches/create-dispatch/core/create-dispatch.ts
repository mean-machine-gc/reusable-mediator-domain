import type { CreateDispatchFn } from './create-dispatch.spec'

export const createDispatch: CreateDispatchFn['signature'] = ({ cmd, state, ctx }) => {
    if (state !== null)
        return { ok: false, errors: ['already_exists'] }

    return {
        ok: true,
        value: {
            status: 'to-deliver',
            id: cmd.dispatchId,
            processingId: cmd.processingId,
            mediationId: cmd.mediationId,
            destination: cmd.destination,
            event: cmd.event,
            createdAt: ctx.createdAt,
        },
        successType: ['dispatch-created'],
    }
}
