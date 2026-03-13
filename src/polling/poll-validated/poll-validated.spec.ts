import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { PollValidatedResult } from '../types'
import { mediateAllSpec } from './steps/mediate-all.spec'
import { createDispatchShellSpec } from '../../dispatches/create-dispatch/create-dispatch.spec'
import { mediateProcessingShellSpec } from '../../incoming-processing/mediate-processing/mediate-processing.spec'
import { failProcessingShellSpec } from '../../incoming-processing/fail-processing/fail-processing.spec'
import { safeGenerateIdSpec } from '../../shared/safe-generate-id.spec'

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
    { name: 'findIncomingProcessingsByState', type: 'dep', description: 'Fetch up to batchSize processing records in validated state' },
    { name: 'findActiveMediationsByTopic', type: 'dep', description: 'Find all active mediations matching a topic' },
    { name: 'getTransformRegistry', type: 'dep', description: 'Retrieve the transform function registry' },
    { name: 'mediateAll', type: 'step', description: 'Run all mediations for an event, collect outcomes', spec: asStepSpec(mediateAllSpec) },
    { name: 'safeGenerateId', type: 'safe-dep', description: 'Generate and validate a unique dispatch ID', spec: asStepSpec(safeGenerateIdSpec) },
    { name: 'createDispatch', type: 'step', description: 'Create a dispatch aggregate for a routed mediation result', spec: asStepSpec(createDispatchShellSpec) },
    { name: 'mediateProcessing', type: 'step', description: 'Transition processing record to mediated with outcomes', spec: asStepSpec(mediateProcessingShellSpec) },
    { name: 'failProcessing', type: 'step', description: 'Transition a record to failed state on error', spec: asStepSpec(failProcessingShellSpec) },
]

// ── Spec ─────────────────────────────────────────────────────────────────────

export const pollValidatedSpec: Spec<PollValidatedFn> = {
    document: true,
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
