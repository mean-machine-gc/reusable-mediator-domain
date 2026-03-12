import type { FailProcessingFn } from './fail-processing.spec'

export const failProcessing: FailProcessingFn['signature'] = ({ cmd, state, ctx }) => {
    if (state.status === 'mediated' || state.status === 'failed')
        return { ok: false, errors: ['already_terminal'] }

    return {
        ok: true,
        value: {
            status: 'failed',
            id: state.id,
            event: state.event,
            topic: state.topic,
            dataschemaUri: state.dataschemaUri,
            receivedAt: state.receivedAt,
            failedAt: ctx.failedAt,
            reason: cmd.reason,
        },
        successType: ['processing-failed'],
    }
}
