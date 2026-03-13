import type { SpecFn, Spec, StepInfo } from '../../../shared/spec-framework'
import { asStepSpec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { FilterStep } from '../../types'
import { evaluateFilterStepSpec } from './evaluate-filter-step.spec'

export type ExecuteFiltersFn = SpecFn<
    { event: CloudEvent; filters: FilterStep[] },
    CloudEvent,
    never,
    'filters-passed' | 'event-skipped'
>

const steps: StepInfo[] = [
    { name: 'evaluateFilterStep', type: 'step', description: 'Evaluate a single filter step', spec: asStepSpec(evaluateFilterStepSpec) },
]

const baseEvent = { type: 'test', source: 'test', data: { status: 'active' } } as unknown as CloudEvent

export const executeFiltersSpec: Spec<ExecuteFiltersFn> = {
    document: true,
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'filters-passed': {
            description: 'All filters pass and the event proceeds',
            examples: [
                {
                    description: 'no filters means event passes through',
                    whenInput: {
                        event: baseEvent,
                        filters: [],
                    },
                    then: baseEvent,
                },
                {
                    description: 'all filters match so event passes',
                    whenInput: {
                        event: baseEvent,
                        filters: [
                            {
                                type: 'filter',
                                rules: {
                                    logic: 'and',
                                    conditions: [
                                        { field: 'data.status', operator: 'equals', value: 'active' },
                                    ],
                                },
                            },
                        ],
                    },
                    then: baseEvent,
                },
            ],
        },
        'event-skipped': {
            description: 'A filter rejects the event',
            examples: [
                {
                    description: 'one filter rejects so event is skipped',
                    whenInput: {
                        event: baseEvent,
                        filters: [
                            {
                                type: 'filter',
                                rules: {
                                    logic: 'and',
                                    conditions: [
                                        { field: 'data.status', operator: 'equals', value: 'inactive' },
                                    ],
                                },
                            },
                        ],
                    },
                    then: baseEvent,
                },
            ],
        },
    },
    shouldAssert: {
        'filters-passed': {},
        'event-skipped': {},
    },
}
