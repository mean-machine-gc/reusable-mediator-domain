import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type {
    ProcessingId,
    ReceivedAt,
    ReceivedProcessing,
    IncomingProcessing,
} from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type ReceiveEventCmd = {
    processingId: ProcessingId
    event: CloudEvent
}

export type ReceiveEventState = IncomingProcessing | null

export type ReceiveEventCtx = {
    receivedAt: ReceivedAt
}

export type ReceiveEventInput = {
    cmd: ReceiveEventCmd
    state: ReceiveEventState
    ctx: ReceiveEventCtx
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type ReceiveEventFn = SpecFn<
    ReceiveEventInput,
    ReceivedProcessing,
    | 'already_exists'
    | 'missing_event_type'
    | 'missing_dataschema',
    'event-received'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const validEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active' },
} as unknown as CloudEvent

const eventWithoutType = {
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient' },
} as unknown as CloudEvent

const eventWithoutSchema = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    data: { resourceType: 'Patient' },
} as unknown as CloudEvent

const processingId = '550e8400-e29b-41d4-a716-446655440000'
const receivedAt = new Date('2025-06-15T10:30:00Z')

const existingState: ReceivedProcessing = {
    status: 'received',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
}

// ── Spec ─────────────────────────────────────────────────────────────────────

export const receiveEventSpec: Spec<ReceiveEventFn> = {
    shouldFailWith: {
        already_exists: {
            description: 'A processing aggregate already exists for this id',
            examples: [
                {
                    description: 'rejects when state is not null',
                    whenInput: {
                        cmd: { processingId, event: validEvent },
                        state: existingState,
                        ctx: { receivedAt },
                    },
                },
            ],
        },
        missing_event_type: {
            description: 'The CloudEvent does not carry a type attribute',
            examples: [
                {
                    description: 'rejects event without type',
                    whenInput: {
                        cmd: { processingId, event: eventWithoutType },
                        state: null,
                        ctx: { receivedAt },
                    },
                },
            ],
        },
        missing_dataschema: {
            description: 'The CloudEvent does not carry a dataschema attribute',
            examples: [
                {
                    description: 'rejects event without dataschema',
                    whenInput: {
                        cmd: { processingId, event: eventWithoutSchema },
                        state: null,
                        ctx: { receivedAt },
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'event-received': {
            description: 'A ReceivedProcessing aggregate is created from the incoming event',
            examples: [
                {
                    description: 'creates received processing from a valid event',
                    whenInput: {
                        cmd: { processingId, event: validEvent },
                        state: null,
                        ctx: { receivedAt },
                    },
                    then: {
                        status: 'received',
                        id: processingId,
                        event: validEvent,
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                        receivedAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'event-received': {
            'status-is-received': {
                description: 'Output status is received',
                assert: (_input, output) => output.status === 'received',
            },
            'id-matches-cmd': {
                description: 'Output id matches the command processingId',
                assert: (input, output) => output.id === input.cmd.processingId,
            },
            'topic-extracted-from-event': {
                description: 'Topic is extracted from event.type',
                assert: (input, output) => output.topic === (input.cmd.event as any).type,
            },
            'dataschema-extracted-from-event': {
                description: 'DataschemaUri is extracted from event.dataschema',
                assert: (input, output) => output.dataschemaUri === (input.cmd.event as any).dataschema,
            },
            'event-preserved': {
                description: 'The original event is preserved unchanged',
                assert: (input, output) => output.event === input.cmd.event,
            },
            'receivedAt-from-ctx': {
                description: 'ReceivedAt comes from the context',
                assert: (input, output) => output.receivedAt === input.ctx.receivedAt,
            },
        },
    },
}
