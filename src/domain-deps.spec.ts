import type { SpecFn, Spec } from './shared/spec-framework'
import type { IncomingProcessing } from './incoming-processing/types'
import type { Dispatch, DeliveryAttempt } from './dispatches/types'
import type { Mediation, ActiveMediation, TransformRegistry } from './mediation/types'
import { ID, Timestamp } from './shared/primitives'

// ── id generation ─────────────────────────────────────────────────────────

export type GenerateIdFn = SpecFn<void, string, never, 'generated'>

export const generateIdSpec: Spec<GenerateIdFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        generated: {
            description: 'A unique ID string is generated',
            examples: [],
        },
    },
    shouldAssert: {
        generated: {
            'value-is-valid-id': {
                description: 'Value is a valid ID (passes parseId)',
                assert: (_input, output) => ID.safeParse(output).success,
            },
        },
    },
}

// ── timestamps ────────────────────────────────────────────────────────────

export type GenerateTimestampFn = SpecFn<void, Date, never, 'generated'>

export const generateTimestampSpec: Spec<GenerateTimestampFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        generated: {
            description: 'A timestamp is generated',
            examples: [],
        },
    },
    shouldAssert: {
        generated: {
            'value-is-valid-timestamp': {
                description: 'Value is a valid Timestamp (passes parseTimestamp)',
                assert: (_input, output) => Timestamp.safeParse(output).success,
            },
        },
    },
}

// ── persistence: getById ──────────────────────────────────────────────────

export type GetIncomingProcessingByIdFn = SpecFn<
    string,
    IncomingProcessing | null,
    never,
    'found' | 'not-found'
>

export const getIncomingProcessingByIdSpec: Spec<GetIncomingProcessingByIdFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'An IncomingProcessing aggregate exists for the given ID',
            examples: [],
        },
        'not-found': {
            description: 'No IncomingProcessing aggregate exists for the given ID',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-null': {
                description: 'Value is not null',
                assert: (_input, output) => output !== null,
            },
        },
        'not-found': {
            'value-is-null': {
                description: 'Value is null',
                assert: (_input, output) => output === null,
            },
        },
    },
}

export type GetDispatchByIdFn = SpecFn<
    string,
    Dispatch | null,
    never,
    'found' | 'not-found'
>

export const getDispatchByIdSpec: Spec<GetDispatchByIdFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'A Dispatch aggregate exists for the given ID',
            examples: [],
        },
        'not-found': {
            description: 'No Dispatch aggregate exists for the given ID',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-null': {
                description: 'Value is not null',
                assert: (_input, output) => output !== null,
            },
        },
        'not-found': {
            'value-is-null': {
                description: 'Value is null',
                assert: (_input, output) => output === null,
            },
        },
    },
}

export type GetMediationByIdFn = SpecFn<
    string,
    Mediation | null,
    never,
    'found' | 'not-found'
>

export const getMediationByIdSpec: Spec<GetMediationByIdFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'A Mediation aggregate exists for the given ID',
            examples: [],
        },
        'not-found': {
            description: 'No Mediation aggregate exists for the given ID',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-null': {
                description: 'Value is not null',
                assert: (_input, output) => output !== null,
            },
        },
        'not-found': {
            'value-is-null': {
                description: 'Value is null',
                assert: (_input, output) => output === null,
            },
        },
    },
}

// ── persistence: upsert ───────────────────────────────────────────────────

export type UpsertIncomingProcessingFn = SpecFn<
    IncomingProcessing,
    void,
    never,
    'upserted'
>

export const upsertIncomingProcessingSpec: Spec<UpsertIncomingProcessingFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        upserted: {
            description: 'The IncomingProcessing aggregate is persisted',
            examples: [],
        },
    },
    shouldAssert: {
        upserted: {
            'value-is-undefined': {
                description: 'Value is undefined',
                assert: (_input, output) => output === undefined,
            },
        },
    },
}

export type UpsertDispatchFn = SpecFn<
    Dispatch,
    void,
    never,
    'upserted'
>

export const upsertDispatchSpec: Spec<UpsertDispatchFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        upserted: {
            description: 'The Dispatch aggregate is persisted',
            examples: [],
        },
    },
    shouldAssert: {
        upserted: {
            'value-is-undefined': {
                description: 'Value is undefined',
                assert: (_input, output) => output === undefined,
            },
        },
    },
}

export type UpsertMediationFn = SpecFn<
    Mediation,
    void,
    never,
    'upserted'
>

export const upsertMediationSpec: Spec<UpsertMediationFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        upserted: {
            description: 'The Mediation aggregate is persisted',
            examples: [],
        },
    },
    shouldAssert: {
        upserted: {
            'value-is-undefined': {
                description: 'Value is undefined',
                assert: (_input, output) => output === undefined,
            },
        },
    },
}

// ── persistence: find ─────────────────────────────────────────────────────

export type FindIncomingProcessingsByStateFn = SpecFn<
    { states: IncomingProcessing['status'][]; batchSize: number },
    IncomingProcessing[],
    never,
    'found' | 'empty'
>

export const findIncomingProcessingsByStateSpec: Spec<FindIncomingProcessingsByStateFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'One or more IncomingProcessing aggregates match the given states',
            examples: [],
        },
        empty: {
            description: 'No IncomingProcessing aggregates match the given states',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-empty': {
                description: 'Value is a non-empty array',
                assert: (_input, output) => Array.isArray(output) && output.length > 0,
            },
        },
        empty: {
            'value-is-empty': {
                description: 'Value is an empty array',
                assert: (_input, output) => Array.isArray(output) && output.length === 0,
            },
        },
    },
}

export type FindDispatchesByStateFn = SpecFn<
    { states: Dispatch['status'][]; batchSize: number },
    Dispatch[],
    never,
    'found' | 'empty'
>

export const findDispatchesByStateSpec: Spec<FindDispatchesByStateFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'One or more Dispatch aggregates match the given states',
            examples: [],
        },
        empty: {
            description: 'No Dispatch aggregates match the given states',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-empty': {
                description: 'Value is a non-empty array',
                assert: (_input, output) => Array.isArray(output) && output.length > 0,
            },
        },
        empty: {
            'value-is-empty': {
                description: 'Value is an empty array',
                assert: (_input, output) => Array.isArray(output) && output.length === 0,
            },
        },
    },
}

export type FindActiveMediationsByTopicFn = SpecFn<
    string,
    ActiveMediation[],
    never,
    'found' | 'empty'
>

export const findActiveMediationsByTopicSpec: Spec<FindActiveMediationsByTopicFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'One or more active mediations match the given topic',
            examples: [],
        },
        empty: {
            description: 'No active mediations match the given topic',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-empty': {
                description: 'Value is a non-empty array',
                assert: (_input, output) => Array.isArray(output) && output.length > 0,
            },
        },
        empty: {
            'value-is-empty': {
                description: 'Value is an empty array',
                assert: (_input, output) => Array.isArray(output) && output.length === 0,
            },
        },
    },
}

// ── others ────────────────────────────────────────────────────────────────

export type ResolveSchemaFn = SpecFn<
    string,
    object | null,
    never,
    'found' | 'not-found'
>

export const resolveSchemaSpec: Spec<ResolveSchemaFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        found: {
            description: 'A schema is resolved for the given dataschema URI',
            examples: [],
        },
        'not-found': {
            description: 'No schema is found for the given dataschema URI',
            examples: [],
        },
    },
    shouldAssert: {
        found: {
            'value-not-null': {
                description: 'Value is not null',
                assert: (_input, output) => output !== null,
            },
        },
        'not-found': {
            'value-is-null': {
                description: 'Value is null',
                assert: (_input, output) => output === null,
            },
        },
    },
}

export type DeliverFn = SpecFn<
    Dispatch,
    DeliveryAttempt,
    never,
    'delivery-successful' | 'delivery-failed'
>

export const deliverSpec: Spec<DeliverFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'delivery-successful': {
            description: 'HTTP delivery succeeded',
            examples: [],
        },
        'delivery-failed': {
            description: 'HTTP delivery failed',
            examples: [],
        },
    },
    shouldAssert: {
        'delivery-successful': {
            'result-is-successful': {
                description: 'DeliveryAttempt result is successful',
                assert: (_input, output) => output.result === 'successful',
            },
        },
        'delivery-failed': {
            'result-is-failed': {
                description: 'DeliveryAttempt result is failed',
                assert: (_input, output) => output.result === 'failed',
            },
        },
    },
}

export type GetMaxAttemptsFn = SpecFn<void, number, never, 'resolved'>

export const getMaxAttemptsSpec: Spec<GetMaxAttemptsFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        resolved: {
            description: 'The max attempts configuration is resolved',
            examples: [],
        },
    },
    shouldAssert: {
        resolved: {
            'value-is-positive-integer': {
                description: 'Value is a positive integer',
                assert: (_input, output) => Number.isInteger(output) && output > 0,
            },
        },
    },
}

export type GetTransformRegistryFn = SpecFn<void, TransformRegistry, never, 'resolved'>

export const getTransformRegistrySpec: Spec<GetTransformRegistryFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        resolved: {
            description: 'The transform registry is resolved',
            examples: [],
        },
    },
    shouldAssert: {
        resolved: {
            'value-is-object': {
                description: 'Value is an object',
                assert: (_input, output) => typeof output === 'object' && output !== null,
            },
        },
    },
}
