import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type {
    IncomingProcessing,
    ReceivedProcessing,
    ValidatedProcessing,
    MediatedProcessing,
    FailedProcessing,
    ValidatedAt,
} from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type ValidateProcessingCmd = {
    processingId: string
}

export type ValidateProcessingState = IncomingProcessing

export type ValidateProcessingCtx = {
    schema: object
    validatedAt: ValidatedAt
}

export type ValidateProcessingInput = {
    cmd: ValidateProcessingCmd
    state: ValidateProcessingState
    ctx: ValidateProcessingCtx
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type ValidateProcessingFn = SpecFn<
    ValidateProcessingInput,
    ValidatedProcessing,
    | 'not_in_received_state'
    | 'schema_validation_failed',
    'processing-validated'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const validEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active' },
} as unknown as CloudEvent

const processingId = '550e8400-e29b-41d4-a716-446655440000'
const receivedAt = new Date('2025-06-15T10:30:00Z')
const validatedAt = new Date('2025-06-15T10:30:01Z')

const receivedState: ReceivedProcessing = {
    status: 'received',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
}

const validatedState: ValidatedProcessing = {
    status: 'validated',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    validatedAt,
}

const mediatedState: MediatedProcessing = {
    status: 'mediated',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    validatedAt,
    mediatedAt: new Date('2025-06-15T10:30:02Z'),
    outcomes: [],
}

const failedState: FailedProcessing = {
    status: 'failed',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    failedAt: new Date('2025-06-15T10:30:02Z'),
    reason: 'some_error',
}

const validSchema = {
    type: 'object',
    properties: {
        resourceType: { type: 'string' },
        status: { type: 'string' },
    },
    required: ['resourceType'],
}

const strictSchema = {
    type: 'object',
    properties: {
        resourceType: { type: 'number' },
    },
    required: ['resourceType'],
}

// ── Spec ─────────────────────────────────────────────────────────────────────

export const validateProcessingSpec: Spec<ValidateProcessingFn> = {
    shouldFailWith: {
        not_in_received_state: {
            description: 'Processing is not in received state',
            examples: [
                {
                    description: 'rejects already validated processing',
                    whenInput: {
                        cmd: { processingId },
                        state: validatedState,
                        ctx: { schema: validSchema, validatedAt },
                    },
                },
                {
                    description: 'rejects mediated processing',
                    whenInput: {
                        cmd: { processingId },
                        state: mediatedState,
                        ctx: { schema: validSchema, validatedAt },
                    },
                },
                {
                    description: 'rejects failed processing',
                    whenInput: {
                        cmd: { processingId },
                        state: failedState,
                        ctx: { schema: validSchema, validatedAt },
                    },
                },
            ],
        },
        schema_validation_failed: {
            description: 'Event data does not conform to the resolved JSON Schema',
            examples: [
                {
                    description: 'event data fails schema validation',
                    whenInput: {
                        cmd: { processingId },
                        state: receivedState,
                        ctx: { schema: strictSchema, validatedAt },
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-validated': {
            description: 'Event data conforms to schema, processing transitions to validated',
            examples: [
                {
                    description: 'validates event data against schema',
                    whenInput: {
                        cmd: { processingId },
                        state: receivedState,
                        ctx: { schema: validSchema, validatedAt },
                    },
                    then: {
                        status: 'validated',
                        id: processingId,
                        event: validEvent,
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                        receivedAt,
                        validatedAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'processing-validated': {
            'status-is-validated': {
                description: 'Output status is validated',
                assert: (_input, output) => output.status === 'validated',
            },
            'id-preserved': {
                description: 'Processing id is preserved from state',
                assert: (input, output) => output.id === input.state.id,
            },
            'event-preserved': {
                description: 'Event is preserved from state',
                assert: (input, output) => output.event === input.state.event,
            },
            'receivedAt-preserved': {
                description: 'ReceivedAt is preserved from state',
                assert: (input, output) => output.receivedAt === input.state.receivedAt,
            },
            'validatedAt-from-ctx': {
                description: 'ValidatedAt comes from the context',
                assert: (input, output) => output.validatedAt === input.ctx.validatedAt,
            },
        },
    },
}
