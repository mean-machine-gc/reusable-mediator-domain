import type { SpecFn, Spec, StepInfo, AnyFn } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { FilterRules } from '../../types'
import { resolveFieldSpec } from './resolve-field.spec'
import { evaluateConditionHandlerSpecs } from './evaluate-condition.spec'
import { composeResultsSpec } from './compose-results.spec'

export type EvaluateFilterStepFn = SpecFn<
    { event: CloudEvent; rules: FilterRules },
    boolean,
    never,
    'filter-matched' | 'filter-rejected'
>

const steps: StepInfo[] = [
    { name: 'resolveField', type: 'step', description: 'Resolve field value from event', spec: resolveFieldSpec as unknown as Spec<AnyFn> },
    { name: 'evaluateCondition', type: 'strategy', description: 'Evaluate condition against field value using operator-specific handler', handlers: evaluateConditionHandlerSpecs as unknown as Record<string, Spec<AnyFn>> },
    { name: 'composeResults', type: 'step', description: 'Compose boolean results with and/or logic', spec: composeResultsSpec as unknown as Spec<AnyFn> },
]

export const evaluateFilterStepSpec: Spec<EvaluateFilterStepFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'filter-matched': {
            description: 'All conditions match the event (filter passes)',
            examples: [
                {
                    description: 'AND logic with all conditions matching returns true',
                    whenInput: {
                        event: { data: { status: 'active' } } as unknown as CloudEvent,
                        rules: {
                            logic: 'and',
                            conditions: [
                                { field: 'data.status', operator: 'equals', value: 'active' },
                            ],
                        },
                    },
                    then: true,
                },
                {
                    description: 'OR logic with one condition matching returns true',
                    whenInput: {
                        event: { data: { status: 'active' } } as unknown as CloudEvent,
                        rules: {
                            logic: 'or',
                            conditions: [
                                { field: 'data.status', operator: 'equals', value: 'inactive' },
                                { field: 'data.status', operator: 'equals', value: 'active' },
                            ],
                        },
                    },
                    then: true,
                },
            ],
        },
        'filter-rejected': {
            description: 'Conditions do not match the event (filter rejects)',
            examples: [
                {
                    description: 'AND logic with one condition failing returns false',
                    whenInput: {
                        event: { data: { status: 'active' } } as unknown as CloudEvent,
                        rules: {
                            logic: 'and',
                            conditions: [
                                { field: 'data.status', operator: 'equals', value: 'active' },
                                { field: 'data.status', operator: 'equals', value: 'inactive' },
                            ],
                        },
                    },
                    then: false,
                },
                {
                    description: 'OR logic with no conditions matching returns false',
                    whenInput: {
                        event: { data: { status: 'active' } } as unknown as CloudEvent,
                        rules: {
                            logic: 'or',
                            conditions: [
                                { field: 'data.status', operator: 'equals', value: 'inactive' },
                                { field: 'data.status', operator: 'equals', value: 'deleted' },
                            ],
                        },
                    },
                    then: false,
                },
            ],
        },
    },
    shouldAssert: {
        'filter-matched': {},
        'filter-rejected': {},
    },
}
