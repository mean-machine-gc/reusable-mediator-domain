import type { MediateProcessingFn } from './mediate-processing.spec'

export const mediateProcessing: MediateProcessingFn['signature'] = ({ state, ctx }) => {
    if (state.status !== 'validated')
        return { ok: false, errors: ['not_in_validated_state'] }

    return {
        ok: true,
        value: {
            status: 'mediated',
            id: state.id,
            event: state.event,
            topic: state.topic,
            dataschemaUri: state.dataschemaUri,
            receivedAt: state.receivedAt,
            validatedAt: state.validatedAt,
            mediatedAt: ctx.mediatedAt,
            outcomes: ctx.outcomes,
        },
        successType: ['processing-mediated'],
    }
}
