import type { ClassifyDeliveryResultsFn } from './classify-delivery-results.spec'

export const classifyDeliveryResults: ClassifyDeliveryResultsFn['signature'] = (input) => {
    const delivered: string[] = []
    const retrying: string[] = []
    const exhausted: string[] = []

    for (const entry of input.entries) {
        if (entry.successType === 'delivered') delivered.push(entry.dispatchId)
        else if (entry.successType === 'attempt-recorded') retrying.push(entry.dispatchId)
        else if (entry.successType === 'max-attempts-exhausted') exhausted.push(entry.dispatchId)
    }

    return { ok: true, value: { delivered, retrying, exhausted }, successType: ['results-classified'] }
}
