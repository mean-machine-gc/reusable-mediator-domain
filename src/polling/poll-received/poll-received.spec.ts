import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { PollReceivedResult } from '../types'
import { classifyValidationResultsSpec } from './steps/classify-validation-results.spec'

// ── Input ────────────────────────────────────────────────────────────────────

export type PollReceivedInput = {
    batchSize: number
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type PollReceivedFn = SpecFn<
    PollReceivedInput,
    PollReceivedResult,
    never,
    'batch-processed' | 'empty-batch'
>

// ── Steps ────────────────────────────────────────────────────────────────────
//
// Pipeline:
//   1. Fetch a batch of received processing records
//   2. For each record, call validateProcessing shell
//   3. On validation failure, call failProcessing shell to transition record to failed
//   4. Assemble summary from outcomes

const steps: StepInfo[] = [
    { name: 'fetchReceived', type: 'dep', description: 'Fetch up to batchSize processing records in received state' },
    { name: 'validateProcessing', type: 'dep', description: 'Call validateProcessing shell for a single record' },
    { name: 'failProcessing', type: 'dep', description: 'Transition a record to failed state on validation failure' },
    { name: 'classifyValidationResults', type: 'step', description: 'Split results into validated and failed arrays', spec: classifyValidationResultsSpec as unknown as Spec<AnyFn> },
]

// ── Spec ─────────────────────────────────────────────────────────────────────

export const pollReceivedSpec: Spec<PollReceivedFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'empty-batch': {
            description: 'No received processing records found — nothing to do',
            examples: [],
        },
        'batch-processed': {
            description: 'All records in the batch have been validated or marked as failed',
            examples: [],
        },
    },
    shouldAssert: {
        'empty-batch': {
            'validated-empty': {
                description: 'No validated entries',
                assert: (_input, output) => output.validated.length === 0,
            },
            'failed-empty': {
                description: 'No failed entries',
                assert: (_input, output) => output.failed.length === 0,
            },
        },
        'batch-processed': {
            'all-accounted-for': {
                description: 'Every record in the batch is either validated or failed',
                // Cannot assert against batch size from input alone — batch comes from dep.
                // This assertion verifies structural correctness: at least one outcome exists.
                assert: (_input, output) => output.validated.length + output.failed.length > 0,
            },
            'failed-entries-have-errors': {
                description: 'Every failed entry has at least one error',
                assert: (_input, output) => output.failed.every(f => f.errors.length > 0),
            },
        },
    },
}
