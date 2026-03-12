import type { SpecFn, Spec } from '../../../shared/spec-framework'

export type ComposeResultsFn = SpecFn<
    { results: boolean[]; logic: 'and' | 'or' },
    boolean,
    never,
    'results-composed'
>

export const composeResultsSpec: Spec<ComposeResultsFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'results-composed': {
            description: 'Composes boolean results using and/or logic',
            examples: [
                {
                    description: 'and with all true returns true',
                    whenInput: { results: [true, true, true], logic: 'and' },
                    then: true,
                },
                {
                    description: 'and with one false returns false',
                    whenInput: { results: [true, false, true], logic: 'and' },
                    then: false,
                },
                {
                    description: 'or with one true returns true',
                    whenInput: { results: [false, true, false], logic: 'or' },
                    then: true,
                },
                {
                    description: 'or with all false returns false',
                    whenInput: { results: [false, false, false], logic: 'or' },
                    then: false,
                },
                {
                    description: 'and with empty array returns true',
                    whenInput: { results: [], logic: 'and' },
                    then: true,
                },
                {
                    description: 'or with empty array returns false',
                    whenInput: { results: [], logic: 'or' },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: {
        'results-composed': {},
    },
}
