import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { PollValidatedResult } from '../types'
import { mediateAllSpec } from './steps/mediate-all.spec'

// ── Input ────────────────────────────────────────────────────────────────────

export type PollValidatedInput = {
    batchSize: number
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type PollValidatedFn = SpecFn<
    PollValidatedInput,
    PollValidatedResult,
    never,
    'batch-processed' | 'empty-batch'
>

// ── Steps ────────────────────────────────────────────────────────────────────
//
// Pipeline (per record):
//   1. Fetch a batch of validated processing records
//   2. For each record:
//      a. Find all active mediations for the record's topic
//      b. Run mediateCore for each mediation (filter/transform pipeline)
//      c. For each routed result, call createDispatch shell
//      d. Call mediateProcessing shell with collected outcomes
//   3. On failure at any sub-step, call failProcessing shell
//   4. Assemble summary from outcomes

const steps: StepInfo[] = [
    { name: 'fetchValidated', type: 'dep', description: 'Fetch up to batchSize processing records in validated state' },
    { name: 'findActiveMediationsByTopic', type: 'dep', description: 'Find all active mediations matching a topic' },
    { name: 'getTransformRegistry', type: 'dep', description: 'Retrieve the transform function registry' },
    { name: 'mediateAll', type: 'step', description: 'Run all mediations for an event, collect outcomes', spec: mediateAllSpec as unknown as Spec<AnyFn> },
    { name: 'generateDispatchId', type: 'dep', description: 'Generate a unique dispatch ID for each routed result' },
    { name: 'createDispatch', type: 'dep', description: 'Create a dispatch aggregate for a routed mediation result' },
    { name: 'mediateProcessing', type: 'dep', description: 'Transition processing record to mediated with outcomes' },
    { name: 'failProcessing', type: 'dep', description: 'Transition a record to failed state on error' },
]

// ── Spec ─────────────────────────────────────────────────────────────────────

export const pollValidatedSpec: Spec<PollValidatedFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'empty-batch': {
            description: 'No validated processing records found — nothing to do',
            examples: [],
        },
        'batch-processed': {
            description: 'All records mediated: dispatches created for routed results, skipped recorded',
            examples: [],
        },
    },
    shouldAssert: {
        'empty-batch': {
            'mediated-empty': {
                description: 'No mediated entries',
                assert: (_input, output) => output.mediated.length === 0,
            },
            'failed-empty': {
                description: 'No failed entries',
                assert: (_input, output) => output.failed.length === 0,
            },
        },
        'batch-processed': {
            'all-accounted-for': {
                description: 'At least one record was processed',
                assert: (_input, output) => output.mediated.length + output.failed.length > 0,
            },
            'dispatches-have-destinations': {
                description: 'Every dispatch entry has a destination',
                assert: (_input, output) =>
                    output.mediated.every(m => m.dispatches.every(d => d.destination.length > 0)),
            },
            'failed-entries-have-errors': {
                description: 'Every failed entry has at least one error',
                assert: (_input, output) => output.failed.every(f => f.errors.length > 0),
            },
        },
    },
}
