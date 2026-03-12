import type { PollReceivedFn } from './poll-received.spec'
import type { ValidationResultEntry } from './steps/classify-validation-results.spec'
import type { ReceivedProcessing } from '../../incoming-processing/types'
import type { Result } from '../../shared/spec-framework'
import type { ClassifyValidationResultsFn } from './steps/classify-validation-results.spec'
import { classifyValidationResults } from './steps/classify-validation-results'

type Steps = {
    classifyValidationResults: ClassifyValidationResultsFn['signature']
}

type Deps = {
    fetchReceived: (batchSize: number) => Promise<ReceivedProcessing[]>
    validateProcessing: (input: { cmd: { processingId: string } }) => Promise<Result<any, string, string>>
    failProcessing: (input: { cmd: { processingId: string; reason: string } }) => Promise<Result<any, string, string>>
}

const pollReceivedFactory =
    (steps: Steps) =>
    (deps: Deps): PollReceivedFn['asyncSignature'] =>
    async (input) => {
        const batch = await deps.fetchReceived(input.batchSize)

        if (batch.length === 0) {
            return { ok: true, value: { validated: [], failed: [] }, successType: ['empty-batch'] }
        }

        const entries: ValidationResultEntry[] = []

        for (const record of batch) {
            const result = await deps.validateProcessing({ cmd: { processingId: record.id } })

            if (result.ok) {
                entries.push({ processingId: record.id, ok: true })
            } else {
                await deps.failProcessing({
                    cmd: { processingId: record.id, reason: result.errors.join(', ') },
                })
                entries.push({ processingId: record.id, ok: false, errors: result.errors })
            }
        }

        const classified = steps.classifyValidationResults({ entries })
        if (!classified.ok) return classified as any

        return { ok: true, value: classified.value, successType: ['batch-processed'] }
    }

export const pollReceived = pollReceivedFactory({
    classifyValidationResults,
})
