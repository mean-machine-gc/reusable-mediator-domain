import type { ClassifyValidationResultsFn } from './classify-validation-results.spec'

export const classifyValidationResults: ClassifyValidationResultsFn['signature'] = (input) => {
    const validated: { processingId: string }[] = []
    const failed: { processingId: string; errors: string[] }[] = []

    for (const entry of input.entries) {
        if (entry.ok) {
            validated.push({ processingId: entry.processingId })
        } else {
            failed.push({ processingId: entry.processingId, errors: entry.errors })
        }
    }

    return { ok: true, value: { validated, failed }, successType: ['results-classified'] }
}
