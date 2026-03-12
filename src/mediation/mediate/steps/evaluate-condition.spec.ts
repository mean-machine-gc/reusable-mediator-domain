import type { SpecFn, StrategyFn, Spec, AnyFn } from '../../../shared/spec-framework'
import type { FilterCondition } from '../../types'

// ── Handler SpecFn (each operator is tested individually) ───────────────────

export type EvaluateConditionHandlerFn = SpecFn<
    { fieldValue: unknown; condition: FilterCondition },
    boolean,
    never,
    'condition-evaluated'
>

// ── Strategy phantom type ───────────────────────────────────────────────────

export type EvaluateConditionStrategyFn = StrategyFn<
    'evaluateCondition',
    { fieldValue: unknown; condition: FilterCondition },
    boolean,
    FilterCondition['operator'],
    never,
    'condition-evaluated'
>

export const equalsHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Evaluates equality between field value and condition value',
            examples: [
                {
                    description: 'returns true when values are equal',
                    whenInput: { fieldValue: 'foo', condition: { field: 'x', operator: 'equals', value: 'foo' } },
                    then: true,
                },
                {
                    description: 'returns false when values are not equal',
                    whenInput: { fieldValue: 'foo', condition: { field: 'x', operator: 'equals', value: 'bar' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const notEqualsHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Evaluates inequality between field value and condition value',
            examples: [
                {
                    description: 'returns true when values are not equal',
                    whenInput: { fieldValue: 'foo', condition: { field: 'x', operator: 'not_equals', value: 'bar' } },
                    then: true,
                },
                {
                    description: 'returns false when values are equal',
                    whenInput: { fieldValue: 'foo', condition: { field: 'x', operator: 'not_equals', value: 'foo' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const existsHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if field value exists (is not undefined)',
            examples: [
                {
                    description: 'returns true when field value exists',
                    whenInput: { fieldValue: 'something', condition: { field: 'x', operator: 'exists' } },
                    then: true,
                },
                {
                    description: 'returns false when field value is undefined',
                    whenInput: { fieldValue: undefined, condition: { field: 'x', operator: 'exists' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const notExistsHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if field value does not exist (is undefined)',
            examples: [
                {
                    description: 'returns true when field value is undefined',
                    whenInput: { fieldValue: undefined, condition: { field: 'x', operator: 'not_exists' } },
                    then: true,
                },
                {
                    description: 'returns false when field value exists',
                    whenInput: { fieldValue: 'something', condition: { field: 'x', operator: 'not_exists' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const containsHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if string field value contains substring',
            examples: [
                {
                    description: 'returns true when string contains value',
                    whenInput: { fieldValue: 'hello world', condition: { field: 'x', operator: 'contains', value: 'world' } },
                    then: true,
                },
                {
                    description: 'returns false when field is not a string',
                    whenInput: { fieldValue: 42, condition: { field: 'x', operator: 'contains', value: 'world' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const startsWithHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if string field value starts with prefix',
            examples: [
                {
                    description: 'returns true when string starts with value',
                    whenInput: { fieldValue: 'hello', condition: { field: 'x', operator: 'starts_with', value: 'hel' } },
                    then: true,
                },
                {
                    description: 'returns false when string does not start with value',
                    whenInput: { fieldValue: 'hello', condition: { field: 'x', operator: 'starts_with', value: 'world' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const endsWithHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if string field value ends with suffix',
            examples: [
                {
                    description: 'returns true when string ends with value',
                    whenInput: { fieldValue: 'hello', condition: { field: 'x', operator: 'ends_with', value: 'llo' } },
                    then: true,
                },
                {
                    description: 'returns false when string does not end with value',
                    whenInput: { fieldValue: 'hello', condition: { field: 'x', operator: 'ends_with', value: 'hel' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const regexHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Tests field value against a regex pattern',
            examples: [
                {
                    description: 'returns true when string matches regex',
                    whenInput: { fieldValue: 'test123', condition: { field: 'x', operator: 'regex', pattern: '^test\\d+' } },
                    then: true,
                },
                {
                    description: 'returns false when string does not match regex',
                    whenInput: { fieldValue: 'hello', condition: { field: 'x', operator: 'regex', pattern: '^test\\d+' } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const greaterThanHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if numeric field value is greater than condition value',
            examples: [
                {
                    description: 'returns true when field value is greater',
                    whenInput: { fieldValue: 10, condition: { field: 'x', operator: 'greater_than', value: 5 } },
                    then: true,
                },
                {
                    description: 'returns false when field value is less',
                    whenInput: { fieldValue: 3, condition: { field: 'x', operator: 'greater_than', value: 5 } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const lessThanHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if numeric field value is less than condition value',
            examples: [
                {
                    description: 'returns true when field value is less',
                    whenInput: { fieldValue: 3, condition: { field: 'x', operator: 'less_than', value: 5 } },
                    then: true,
                },
                {
                    description: 'returns false when field value is greater',
                    whenInput: { fieldValue: 10, condition: { field: 'x', operator: 'less_than', value: 5 } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const greaterThanOrEqualHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if numeric field value is greater than or equal to condition value',
            examples: [
                {
                    description: 'returns true when field value is greater',
                    whenInput: { fieldValue: 10, condition: { field: 'x', operator: 'greater_than_or_equal', value: 5 } },
                    then: true,
                },
                {
                    description: 'returns true when field value is equal',
                    whenInput: { fieldValue: 5, condition: { field: 'x', operator: 'greater_than_or_equal', value: 5 } },
                    then: true,
                },
                {
                    description: 'returns false when field value is less',
                    whenInput: { fieldValue: 3, condition: { field: 'x', operator: 'greater_than_or_equal', value: 5 } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const lessThanOrEqualHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if numeric field value is less than or equal to condition value',
            examples: [
                {
                    description: 'returns true when field value is less',
                    whenInput: { fieldValue: 3, condition: { field: 'x', operator: 'less_than_or_equal', value: 5 } },
                    then: true,
                },
                {
                    description: 'returns true when field value is equal',
                    whenInput: { fieldValue: 5, condition: { field: 'x', operator: 'less_than_or_equal', value: 5 } },
                    then: true,
                },
                {
                    description: 'returns false when field value is greater',
                    whenInput: { fieldValue: 10, condition: { field: 'x', operator: 'less_than_or_equal', value: 5 } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const inHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if field value is in a list of values',
            examples: [
                {
                    description: 'returns true when field value is in list',
                    whenInput: { fieldValue: 'a', condition: { field: 'x', operator: 'in', values: ['a', 'b'] } },
                    then: true,
                },
                {
                    description: 'returns false when field value is not in list',
                    whenInput: { fieldValue: 'c', condition: { field: 'x', operator: 'in', values: ['a', 'b'] } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

export const notInHandlerSpec: Spec<EvaluateConditionHandlerFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'condition-evaluated': {
            description: 'Checks if field value is not in a list of values',
            examples: [
                {
                    description: 'returns true when field value is not in list',
                    whenInput: { fieldValue: 'c', condition: { field: 'x', operator: 'not_in', values: ['a', 'b'] } },
                    then: true,
                },
                {
                    description: 'returns false when field value is in list',
                    whenInput: { fieldValue: 'a', condition: { field: 'x', operator: 'not_in', values: ['a', 'b'] } },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: { 'condition-evaluated': {} },
}

// ── Combined handler specs record (used by testSpec loop and strategy step) ─

export const evaluateConditionHandlerSpecs: Record<FilterCondition['operator'], Spec<EvaluateConditionHandlerFn>> = {
    equals: equalsHandlerSpec,
    not_equals: notEqualsHandlerSpec,
    exists: existsHandlerSpec,
    not_exists: notExistsHandlerSpec,
    contains: containsHandlerSpec,
    starts_with: startsWithHandlerSpec,
    ends_with: endsWithHandlerSpec,
    regex: regexHandlerSpec,
    greater_than: greaterThanHandlerSpec,
    less_than: lessThanHandlerSpec,
    greater_than_or_equal: greaterThanOrEqualHandlerSpec,
    less_than_or_equal: lessThanOrEqualHandlerSpec,
    in: inHandlerSpec,
    not_in: notInHandlerSpec,
}

// ── Strategy handler specs (for StrategyStep in parent factory specs) ───────

export const evaluateConditionStrategyHandlerSpecs = {
    equals: equalsHandlerSpec,
    not_equals: notEqualsHandlerSpec,
    exists: existsHandlerSpec,
    not_exists: notExistsHandlerSpec,
    contains: containsHandlerSpec,
    starts_with: startsWithHandlerSpec,
    ends_with: endsWithHandlerSpec,
    regex: regexHandlerSpec,
    greater_than: greaterThanHandlerSpec,
    less_than: lessThanHandlerSpec,
    greater_than_or_equal: greaterThanOrEqualHandlerSpec,
    less_than_or_equal: lessThanOrEqualHandlerSpec,
    in: inHandlerSpec,
    not_in: notInHandlerSpec,
} satisfies Record<EvaluateConditionStrategyFn['cases'], Spec<EvaluateConditionHandlerFn>> as unknown as Record<EvaluateConditionStrategyFn['cases'], Spec<AnyFn>>
