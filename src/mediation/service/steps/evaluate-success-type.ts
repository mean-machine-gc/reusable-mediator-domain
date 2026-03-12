import type { EvaluateServiceSuccessTypeFn } from './evaluate-success-type.spec'

export const evaluateServiceSuccessType: EvaluateServiceSuccessTypeFn['signature'] = (input) => {
    return {
        ok: true,
        value: { topic: input.topic, dispatches: input.dispatches, skipped: input.skipped },
        successType: ['events-dispatched'],
    }
}
