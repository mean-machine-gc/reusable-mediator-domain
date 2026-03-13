import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { FailedAt } from '../../types'
import { timestamps } from '../../fixtures'

export type ParseFailedAtFailures = 'invalid_failed_at'

export type ParseFailedAtFn = SpecFn<
    unknown,
    FailedAt,
    ParseFailedAtFailures,
    'failed-at-parsed'
>

export const parseFailedAtSpec: Spec<ParseFailedAtFn> = {
    shouldFailWith: {
        invalid_failed_at: {
            description: 'Input is not a valid failed-at timestamp',
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
        'failed-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: timestamps.valid.failedAt,
                    then: timestamps.valid.failedAt,
                },
            ],
        },
    },
    shouldAssert: {
        'failed-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
