import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type {
    IncomingProcessing,
    ReceivedProcessing,
    ValidatedProcessing,
    MediatedProcessing,
    FailedProcessing,
    MediatedAt,
    MediationOutcome,
} from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type MediateProcessingCmd = {
    processingId: string
}

export type MediateProcessingState = IncomingProcessing

export type MediateProcessingCtx = {
    outcomes: MediationOutcome[]
    mediatedAt: MediatedAt
}

export type MediateProcessingInput = {
    cmd: MediateProcessingCmd
    state: MediateProcessingState
    ctx: MediateProcessingCtx
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type MediateProcessingFn = SpecFn<
    MediateProcessingInput,
    MediatedProcessing,
    'not_in_validated_state',
    'processing-mediated'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const validEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active' },
} as unknown as CloudEvent

const transformedEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active', routed: true },
} as unknown as CloudEvent

const processingId = '550e8400-e29b-41d4-a716-446655440000'
const receivedAt = new Date('2025-06-15T10:30:00Z')
const validatedAt = new Date('2025-06-15T10:30:01Z')
const mediatedAt = new Date('2025-06-15T10:30:02Z')

const validatedState: ValidatedProcessing = {
    status: 'validated',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    validatedAt,
}

const receivedState: ReceivedProcessing = {
    status: 'received',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
}

const mediatedState: MediatedProcessing = {
    status: 'mediated',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    validatedAt,
    mediatedAt,
    outcomes: [],
}

const failedState: FailedProcessing = {
    status: 'failed',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    failedAt: new Date('2025-06-15T10:30:03Z'),
    reason: 'some_error',
}

const outcomes: MediationOutcome[] = [
    {
        result: 'dispatched',
        mediationId: '00000000-0000-0000-0000-000000000001',
        destination: 'https://shr.example.com/fhir',
        event: transformedEvent,
    },
    {
        result: 'skipped',
        mediationId: '00000000-0000-0000-0000-000000000002',
        destination: 'https://audit.example.com/log',
    },
]

const emptyOutcomes: MediationOutcome[] = []

// ── Spec ─────────────────────────────────────────────────────────────────────

export const mediateProcessingSpec: Spec<MediateProcessingFn> = {
    shouldFailWith: {
        not_in_validated_state: {
            description: 'Processing is not in validated state',
            examples: [
                {
                    description: 'rejects received processing',
                    whenInput: {
                        cmd: { processingId },
                        state: receivedState,
                        ctx: { outcomes, mediatedAt },
                    },
                },
                {
                    description: 'rejects already mediated processing',
                    whenInput: {
                        cmd: { processingId },
                        state: mediatedState,
                        ctx: { outcomes, mediatedAt },
                    },
                },
                {
                    description: 'rejects failed processing',
                    whenInput: {
                        cmd: { processingId },
                        state: failedState,
                        ctx: { outcomes, mediatedAt },
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-mediated': {
            description: 'Processing transitions to mediated with outcomes attached',
            examples: [
                {
                    description: 'mediated with dispatched and skipped outcomes',
                    whenInput: {
                        cmd: { processingId },
                        state: validatedState,
                        ctx: { outcomes, mediatedAt },
                    },
                    then: {
                        status: 'mediated',
                        id: processingId,
                        event: validEvent,
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                        receivedAt,
                        validatedAt,
                        mediatedAt,
                        outcomes,
                    },
                },
                {
                    description: 'mediated with no outcomes (no mediations matched)',
                    whenInput: {
                        cmd: { processingId },
                        state: validatedState,
                        ctx: { outcomes: emptyOutcomes, mediatedAt },
                    },
                    then: {
                        status: 'mediated',
                        id: processingId,
                        event: validEvent,
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                        receivedAt,
                        validatedAt,
                        mediatedAt,
                        outcomes: emptyOutcomes,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'processing-mediated': {
            'status-is-mediated': {
                description: 'Output status is mediated',
                assert: (_input, output) => output.status === 'mediated',
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
            'validatedAt-preserved': {
                description: 'ValidatedAt is preserved from state',
                assert: (input, output) => input.state.status === 'validated' && output.validatedAt === input.state.validatedAt,
            },
            'mediatedAt-from-ctx': {
                description: 'MediatedAt comes from the context',
                assert: (input, output) => output.mediatedAt === input.ctx.mediatedAt,
            },
            'outcomes-from-ctx': {
                description: 'Outcomes come from the context',
                assert: (input, output) => output.outcomes === input.ctx.outcomes,
            },
        },
    },
}
