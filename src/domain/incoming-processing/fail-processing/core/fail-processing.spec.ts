import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type {
    ProcessingFailureReason,
    IncomingProcessing,
    ReceivedProcessing,
    ValidatedProcessing,
    MediatedProcessing,
    FailedProcessing,
    FailedAt,
} from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type FailProcessingCmd = {
    processingId: string
    reason: ProcessingFailureReason
}

export type FailProcessingState = IncomingProcessing

export type FailProcessingCtx = {
    failedAt: FailedAt
}

export type FailProcessingInput = {
    cmd: FailProcessingCmd
    state: FailProcessingState
    ctx: FailProcessingCtx
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type FailProcessingFn = SpecFn<
    FailProcessingInput,
    FailedProcessing,
    'already_terminal',
    'processing-failed'
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
const failedAt = new Date('2025-06-15T10:30:02Z')

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

const alreadyFailedState: FailedProcessing = {
    status: 'failed',
    id: processingId,
    event: validEvent,
    topic: 'org.openhim.patient.created.v1',
    dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
    receivedAt,
    failedAt,
    reason: 'previous_error',
}

// ── Spec ─────────────────────────────────────────────────────────────────────

export const failProcessingSpec: Spec<FailProcessingFn> = {
    shouldFailWith: {
        already_terminal: {
            description: 'Processing is already in a terminal state',
            examples: [
                {
                    description: 'rejects already mediated processing',
                    whenInput: {
                        cmd: { processingId, reason: 'some_error' },
                        state: mediatedState,
                        ctx: { failedAt },
                    },
                },
                {
                    description: 'rejects already failed processing',
                    whenInput: {
                        cmd: { processingId, reason: 'some_error' },
                        state: alreadyFailedState,
                        ctx: { failedAt },
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-failed': {
            description: 'Processing transitions to failed with a reason',
            examples: [
                {
                    description: 'fails a received processing',
                    whenInput: {
                        cmd: { processingId, reason: 'schema_not_found' },
                        state: receivedState,
                        ctx: { failedAt },
                    },
                    then: {
                        status: 'failed',
                        id: processingId,
                        event: validEvent,
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                        receivedAt,
                        failedAt,
                        reason: 'schema_not_found',
                    },
                },
                {
                    description: 'fails a validated processing',
                    whenInput: {
                        cmd: { processingId, reason: 'unknown_transform' },
                        state: validatedState,
                        ctx: { failedAt },
                    },
                    then: {
                        status: 'failed',
                        id: processingId,
                        event: validEvent,
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                        receivedAt,
                        failedAt,
                        reason: 'unknown_transform',
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'processing-failed': {
            'status-is-failed': {
                description: 'Output status is failed',
                assert: (_input, output) => output.status === 'failed',
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
            'reason-from-cmd': {
                description: 'Reason comes from the command',
                assert: (input, output) => output.reason === input.cmd.reason,
            },
            'failedAt-from-ctx': {
                description: 'FailedAt comes from the context',
                assert: (input, output) => output.failedAt === input.ctx.failedAt,
            },
        },
    },
}
