import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'

export type ResolveFieldFn = SpecFn<
    { event: CloudEvent; path: string },
    unknown,
    never,
    'field-resolved'
>

export const resolveFieldSpec: Spec<ResolveFieldFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'field-resolved': {
            description: 'Resolves a field value from a CloudEvent by dot-separated path',
            examples: [
                {
                    description: 'resolves a top-level field',
                    whenInput: {
                        event: { data: { name: 'John' } } as unknown as CloudEvent,
                        path: 'data.name',
                    },
                    then: 'John',
                },
                {
                    description: 'resolves a nested field',
                    whenInput: {
                        event: { data: { address: { city: 'Paris' } } } as unknown as CloudEvent,
                        path: 'data.address.city',
                    },
                    then: 'Paris',
                },
                {
                    description: 'returns undefined for a missing field',
                    whenInput: {
                        event: { data: { name: 'John' } } as unknown as CloudEvent,
                        path: 'data.age',
                    },
                    then: undefined,
                },
                {
                    description: 'returns undefined when intermediate is null',
                    whenInput: {
                        event: { data: { address: null } } as unknown as CloudEvent,
                        path: 'data.address.city',
                    },
                    then: undefined,
                },
            ],
        },
    },
    shouldAssert: {
        'field-resolved': {},
    },
}
