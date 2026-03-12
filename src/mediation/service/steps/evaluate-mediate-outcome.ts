import type { EvaluateMediateOutcomeFn } from './evaluate-mediate-outcome.spec'

export const evaluateMediateOutcome: EvaluateMediateOutcomeFn['signature'] = (input) => {
    const { topic, dispatches, skipped } = input

    if (dispatches.length > 0) {
        return {
            ok: true,
            value: { action: 'dispatch', dispatches },
            successType: ['has-dispatches'],
        }
    }

    const successType: 'all-skipped' | 'no-mediations' =
        skipped.length > 0 ? 'all-skipped' : 'no-mediations'

    return {
        ok: true,
        value: {
            action: 'done',
            result: { topic, dispatches: [], skipped },
        },
        successType: [successType],
    }
}
