import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ValidatedAt } from '../../types'
import { timestamps } from '../../fixtures'

export type ParseValidatedAtFailures = 'invalid_validated_at'

export type ParseValidatedAtFn = SpecFn<
    unknown,
    ValidatedAt,
    ParseValidatedAtFailures,
    'validated-at-parsed'
>

export const parseValidatedAtSpec: Spec<ParseValidatedAtFn> = {
    shouldFailWith: {
        invalid_validated_at: {
            description: 'Input is not a valid validated-at timestamp',
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
        'validated-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: timestamps.valid.validatedAt,
                    then: timestamps.valid.validatedAt,
                },
            ],
        },
    },
    shouldAssert: {
        'validated-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
