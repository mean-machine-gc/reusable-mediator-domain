import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { TransformStep, TransformRegistry } from '../../types'

export type ExecuteTransformsFn = SpecFn<
    { event: CloudEvent; transforms: TransformStep[]; registry: TransformRegistry },
    CloudEvent,
    'unknown_transform',
    'transforms-applied'
>

const baseEvent = { type: 'test', source: 'test' } as unknown as CloudEvent
const transformedEvent = { type: 'test', source: 'test', data: { transformed: true } } as unknown as CloudEvent

export const executeTransformsSpec: Spec<ExecuteTransformsFn> = {
    shouldFailWith: {
        unknown_transform: {
            description: 'Transform name is not found in the registry',
            examples: [
                {
                    description: 'fails when transform name is not in registry',
                    whenInput: {
                        event: baseEvent,
                        transforms: [{ type: 'transform', rules: ['nonexistent'] }],
                        registry: {},
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'transforms-applied': {
            description: 'Applies all transforms from the registry to the event',
            examples: [
                {
                    description: 'returns event unchanged when transforms list is empty',
                    whenInput: {
                        event: baseEvent,
                        transforms: [],
                        registry: {},
                    },
                    then: baseEvent,
                },
                {
                    description: 'applies a known transform to the event',
                    whenInput: {
                        event: baseEvent,
                        transforms: [{ type: 'transform', rules: ['addFlag'] }],
                        registry: { addFlag: () => transformedEvent },
                    },
                    then: transformedEvent,
                },
            ],
        },
    },
    shouldAssert: {
        'transforms-applied': {},
    },
}
