import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { PollReceivedResult } from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type ValidationResultEntry =
    | { processingId: string; ok: true }
    | { processingId: string; ok: false; errors: string[] }

export type ClassifyValidationResultsInput = {
    entries: ValidationResultEntry[]
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type ClassifyValidationResultsFn = SpecFn<
    ClassifyValidationResultsInput,
    PollReceivedResult,
    never,
    'results-classified'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const id1 = '00000000-0000-0000-0000-000000000001'
const id2 = '00000000-0000-0000-0000-000000000002'
const id3 = '00000000-0000-0000-0000-000000000003'

// ── Spec ─────────────────────────────────────────────────────────────────────

export const classifyValidationResultsSpec: Spec<ClassifyValidationResultsFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'results-classified': {
            description: 'Validation results split into validated and failed arrays',
            examples: [
                {
                    description: 'all validated',
                    whenInput: {
                        entries: [
                            { processingId: id1, ok: true },
                            { processingId: id2, ok: true },
                        ],
                    },
                    then: {
                        validated: [{ processingId: id1 }, { processingId: id2 }],
                        failed: [],
                    },
                },
                {
                    description: 'all failed',
                    whenInput: {
                        entries: [
                            { processingId: id1, ok: false, errors: ['schema_validation_failed'] },
                        ],
                    },
                    then: {
                        validated: [],
                        failed: [{ processingId: id1, errors: ['schema_validation_failed'] }],
                    },
                },
                {
                    description: 'mixed results',
                    whenInput: {
                        entries: [
                            { processingId: id1, ok: true },
                            { processingId: id2, ok: false, errors: ['schema_not_found'] },
                            { processingId: id3, ok: true },
                        ],
                    },
                    then: {
                        validated: [{ processingId: id1 }, { processingId: id3 }],
                        failed: [{ processingId: id2, errors: ['schema_not_found'] }],
                    },
                },
                {
                    description: 'empty input',
                    whenInput: { entries: [] },
                    then: { validated: [], failed: [] },
                },
            ],
        },
    },
    shouldAssert: {
        'results-classified': {
            'all-accounted-for': {
                description: 'Total validated + failed equals input length',
                assert: (input, output) =>
                    output.validated.length + output.failed.length === input.entries.length,
            },
            'failed-have-errors': {
                description: 'Every failed entry has at least one error',
                assert: (_input, output) =>
                    output.failed.every(f => f.errors.length > 0),
            },
        },
    },
}
