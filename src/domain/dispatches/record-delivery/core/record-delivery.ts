import type { RecordDeliveryFn } from './record-delivery.spec'

export const recordDelivery: RecordDeliveryFn['signature'] = ({ state, ctx }) => {
    if (state.status === 'delivered' || state.status === 'failed')
        return { ok: false, errors: ['already_terminal'] }

    const previousAttempts = state.status === 'attempted' ? state.attempts : []
    const previousCount = state.status === 'attempted' ? state.attemptCount : 0
    const attempts = [...previousAttempts, ctx.attempt]
    const attemptCount = previousCount + 1

    // Successful attempt → delivered
    if (ctx.attempt.result === 'successful') {
        return {
            ok: true,
            value: {
                status: 'delivered',
                id: state.id,
                processingId: state.processingId,
                mediationId: state.mediationId,
                destination: state.destination,
                event: state.event,
                createdAt: state.createdAt,
                attempts,
                attemptCount,
                deliveredAt: ctx.attempt.attemptedAt,
            },
            successType: ['delivered'],
        }
    }

    // Failed attempt, max reached → failed
    if (attemptCount >= ctx.maxAttempts) {
        return {
            ok: true,
            value: {
                status: 'failed',
                id: state.id,
                processingId: state.processingId,
                mediationId: state.mediationId,
                destination: state.destination,
                event: state.event,
                createdAt: state.createdAt,
                attempts,
                attemptCount,
                failedAt: ctx.attempt.attemptedAt,
            },
            successType: ['max-attempts-exhausted'],
        }
    }

    // Failed attempt, retries remaining → attempted
    return {
        ok: true,
        value: {
            status: 'attempted',
            id: state.id,
            processingId: state.processingId,
            mediationId: state.mediationId,
            destination: state.destination,
            event: state.event,
            createdAt: state.createdAt,
            attempts,
            attemptCount,
        },
        successType: ['attempt-recorded'],
    }
}
