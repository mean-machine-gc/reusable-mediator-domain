import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { MediatedAt } from '../../types'
import { timestamps } from '../../fixtures'

export type ParseMediatedAtFailures = 'invalid_mediated_at'

export type ParseMediatedAtFn = SpecFn<
    unknown,
    MediatedAt,
    ParseMediatedAtFailures,
    'mediated-at-parsed'
>

export const parseMediatedAtSpec: Spec<ParseMediatedAtFn> = {
    shouldFailWith: {
        invalid_mediated_at: {
            description: 'Input is not a valid mediated-at timestamp',
            examples: [
                { description: 'string input', whenInput: timestamps.invalid.string },
                { description: 'number input', whenInput: timestamps.invalid.number },
                { description: 'null input', whenInput: timestamps.invalid.null },
                { description: 'undefined input', whenInput: timestamps.invalid.undefined },
                { description: 'invalid date object', whenInput: timestamps.invalid.invalidDate },
            ],
        },
    },
    shouldSucceedWith: {
        'mediated-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: timestamps.valid.mediatedAt,
                    then: timestamps.valid.mediatedAt,
                },
            ],
        },
    },
    shouldAssert: {
        'mediated-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
