import type { EvaluateServiceSuccessTypeFn } from './evaluate-success-type.spec'

export const evaluateServiceSuccessType: EvaluateServiceSuccessTypeFn['signature'] = (input) => {
    const { topic, dispatches, skipped } = input

    const successType: 'events-dispatched' | 'all-skipped' | 'no-mediations' =
        dispatches.length > 0
            ? 'events-dispatched'
            : skipped.length > 0
                ? 'all-skipped'
                : 'no-mediations'

    return {
        ok: true,
        value: { topic, dispatches, skipped },
        successType: [successType],
    }
}
