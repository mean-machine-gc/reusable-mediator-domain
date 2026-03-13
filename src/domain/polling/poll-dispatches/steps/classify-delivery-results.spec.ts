import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { PollDispatchesResult } from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type DeliveryResultEntry = {
    dispatchId: string
    successType: 'delivered' | 'attempt-recorded' | 'max-attempts-exhausted'
}

export type ClassifyDeliveryResultsInput = {
    entries: DeliveryResultEntry[]
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type ClassifyDeliveryResultsFn = SpecFn<
    ClassifyDeliveryResultsInput,
    PollDispatchesResult,
    never,
    'results-classified'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const id1 = 'a0000000-0000-0000-0000-000000000001'
const id2 = 'a0000000-0000-0000-0000-000000000002'
const id3 = 'a0000000-0000-0000-0000-000000000003'

// ── Spec ─────────────────────────────────────────────────────────────────────

export const classifyDeliveryResultsSpec: Spec<ClassifyDeliveryResultsFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'results-classified': {
            description: 'Delivery results classified into delivered, retrying, and exhausted',
            examples: [
                {
                    description: 'one of each outcome',
                    whenInput: {
                        entries: [
                            { dispatchId: id1, successType: 'delivered' },
                            { dispatchId: id2, successType: 'attempt-recorded' },
                            { dispatchId: id3, successType: 'max-attempts-exhausted' },
                        ],
                    },
                    then: {
                        delivered: [id1],
                        retrying: [id2],
                        exhausted: [id3],
                    },
                },
                {
                    description: 'all delivered',
                    whenInput: {
                        entries: [
                            { dispatchId: id1, successType: 'delivered' },
                            { dispatchId: id2, successType: 'delivered' },
                        ],
                    },
                    then: {
                        delivered: [id1, id2],
                        retrying: [],
                        exhausted: [],
                    },
                },
                {
                    description: 'empty input',
                    whenInput: { entries: [] },
                    then: { delivered: [], retrying: [], exhausted: [] },
                },
            ],
        },
    },
    shouldAssert: {
        'results-classified': {
            'all-accounted-for': {
                description: 'Total across all categories equals input length',
                assert: (input, output) =>
                    output.delivered.length + output.retrying.length + output.exhausted.length === input.entries.length,
            },
            'no-duplicates': {
                description: 'No dispatch ID appears in more than one category',
                assert: (_input, output) => {
                    const all = [...output.delivered, ...output.retrying, ...output.exhausted]
                    return new Set(all).size === all.length
                },
            },
        },
    },
}
