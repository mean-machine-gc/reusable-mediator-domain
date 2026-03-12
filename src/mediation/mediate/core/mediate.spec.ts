import type { SpecFn, Spec, StepInfo, AnyFn } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { ActiveMediation, TransformRegistry } from '../../types'
import { executeFiltersSpec } from '../steps/execute-filters.spec'
import { executeTransformsSpec } from '../steps/execute-transforms.spec'

export type MediateCoreFn = SpecFn<
    { event: CloudEvent; mediation: ActiveMediation; registry: TransformRegistry },
    CloudEvent,
    'unknown_transform',
    'event-processed' | 'event-skipped'
>

const steps: StepInfo[] = [
    { name: 'executeFilters', type: 'step', description: 'Run all filter steps', spec: executeFiltersSpec as unknown as Spec<AnyFn> },
    { name: 'executeTransforms', type: 'step', description: 'Apply all transformations', spec: executeTransformsSpec as unknown as Spec<AnyFn> },
]

const baseEvent = { type: 'test', source: 'test', data: { status: 'active' } } as unknown as CloudEvent
const transformedEvent = { type: 'test', source: 'test', data: { status: 'active', transformed: true } } as unknown as CloudEvent

const baseMediation: ActiveMediation = {
    status: 'active',
    id: '00000000-0000-0000-0000-000000000001',
    topic: 'orders.created',
    schema: {},
    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-02'),
}

export const mediateCoreSpec: Spec<MediateCoreFn> = {
    steps,
    shouldFailWith: {
        unknown_transform: {
            description: 'A transform name is not found in the registry',
            examples: [
                {
                    description: 'fails when transform is not in registry',
                    whenInput: {
                        event: baseEvent,
                        mediation: {
                            ...baseMediation,
                            pipeline: [
                                { type: 'transform', rules: ['nonexistent'] },
                            ],
                        },
                        registry: {},
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'event-processed': {
            description: 'Event passes filters and transforms are applied',
            examples: [
                {
                    description: 'processes event with matching filter and known transform',
                    whenInput: {
                        event: baseEvent,
                        mediation: {
                            ...baseMediation,
                            pipeline: [
                                {
                                    type: 'filter',
                                    rules: {
                                        logic: 'and',
                                        conditions: [
                                            { field: 'data.status', operator: 'equals', value: 'active' },
                                        ],
                                    },
                                },
                                { type: 'transform', rules: ['addFlag'] },
                            ],
                        },
                        registry: { addFlag: () => transformedEvent },
                    },
                    then: transformedEvent,
                },
                {
                    description: 'processes event with empty pipeline',
                    whenInput: {
                        event: baseEvent,
                        mediation: baseMediation,
                        registry: {},
                    },
                    then: baseEvent,
                },
            ],
        },
        'event-skipped': {
            description: 'Event is rejected by a filter',
            examples: [
                {
                    description: 'skips event when filter rejects',
                    whenInput: {
                        event: baseEvent,
                        mediation: {
                            ...baseMediation,
                            pipeline: [
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
                        registry: {},
                    },
                    then: baseEvent,
                },
            ],
        },
    },
    shouldAssert: {
        'event-processed': {},
        'event-skipped': {},
    },
}
