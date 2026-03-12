import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { PollDispatchesResult } from '../types'
import { classifyDeliveryResultsSpec } from './steps/classify-delivery-results.spec'

// ── Input ────────────────────────────────────────────────────────────────────

export type PollDispatchesInput = {
    batchSize: number
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type PollDispatchesFn = SpecFn<
    PollDispatchesInput,
    PollDispatchesResult,
    never,
    'batch-processed' | 'empty-batch'
>

// ── Steps ────────────────────────────────────────────────────────────────────
//
// Pipeline:
//   1. Fetch a batch of dispatches in to-deliver or attempted state
//   2. For each dispatch, call recordDelivery shell (which performs HTTP delivery
//      and transitions state based on attempt result and retry budget)
//   3. Classify outcomes by successType: delivered, attempt-recorded, max-attempts-exhausted
//   4. Assemble summary

const steps: StepInfo[] = [
    { name: 'fetchDispatches', type: 'dep', description: 'Fetch up to batchSize dispatches in to-deliver or attempted state' },
    { name: 'recordDelivery', type: 'dep', description: 'Call recordDelivery shell — attempts delivery and records outcome' },
    { name: 'classifyDeliveryResults', type: 'step', description: 'Classify delivery outcomes into delivered, retrying, exhausted', spec: classifyDeliveryResultsSpec as unknown as Spec<AnyFn> },
]

// ── Spec ─────────────────────────────────────────────────────────────────────

export const pollDispatchesSpec: Spec<PollDispatchesFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'empty-batch': {
            description: 'No dispatches pending delivery — nothing to do',
            examples: [],
        },
        'batch-processed': {
            description: 'All dispatches in the batch have been attempted',
            examples: [],
        },
    },
    shouldAssert: {
        'empty-batch': {
            'delivered-empty': {
                description: 'No delivered entries',
                assert: (_input, output) => output.delivered.length === 0,
            },
            'retrying-empty': {
                description: 'No retrying entries',
                assert: (_input, output) => output.retrying.length === 0,
            },
            'exhausted-empty': {
                description: 'No exhausted entries',
                assert: (_input, output) => output.exhausted.length === 0,
            },
        },
        'batch-processed': {
            'all-accounted-for': {
                description: 'At least one dispatch was processed',
                assert: (_input, output) =>
                    output.delivered.length + output.retrying.length + output.exhausted.length > 0,
            },
            'no-duplicate-ids': {
                description: 'No dispatch ID appears in more than one outcome category',
                assert: (_input, output) => {
                    const all = [...output.delivered, ...output.retrying, ...output.exhausted]
                    return new Set(all).size === all.length
                },
            },
        },
    },
}
