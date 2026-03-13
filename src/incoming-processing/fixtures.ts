import { CloudEvent } from 'cloudevents'
import type {
    ReceivedProcessing,
    ValidatedProcessing,
    MediatedProcessing,
    FailedProcessing,
    DispatchedOutcome,
    SkippedOutcome,
} from './types'

// ── ProcessingId ────────────────────────────────────────────────────────────

export const processingId = {
    valid: {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        anotherUuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    },
    invalid: {
        number: 42,
        null: null,
        undefined: undefined,
        object: { id: 'abc' },
        empty: '',
        tooLong: 'a'.repeat(65),
        notUuid: 'not-a-uuid',
        partialUuid: '550e8400-e29b-41d4',
    },
    injection: {
        scriptTag: '<script>alert("xss")</script>',
        javascriptProtocol: 'javascript:alert(1)',
        eventHandler: 'onclick=alert(1)',
    },
}

// ── DataschemaUri ───────────────────────────────────────────────────────────

export const dataschemaUri = {
    valid: {
        https: 'https://registry.example.com/schemas/patient-created/v1',
        localhost: 'http://localhost:8080/schemas/observation/v2',
    },
    invalid: {
        number: 42,
        null: null,
        undefined: undefined,
        object: { uri: 'https://example.com' },
        empty: '',
        tooLong: 'https://registry.example.com/' + 'a'.repeat(2020),
    },
    invalidUrl: {
        plainText: 'not-a-url',
        missingProtocol: 'registry.example.com/schemas/v1',
        ftpProtocol: 'ftp://registry.example.com/schemas/v1',
    },
    injection: {
        scriptTag: '<script>alert("xss")</script>',
        javascriptProtocol: 'javascript:alert(1)',
    },
}

// ── ProcessingFailureReason ─────────────────────────────────────────────────

export const processingFailureReason = {
    valid: {
        short: 'schema_validation_failed',
        descriptive: 'Event data does not conform to the resolved JSON Schema for patient-created/v1',
    },
    invalid: {
        number: 42,
        null: null,
        undefined: undefined,
        object: { reason: 'failed' },
        empty: '',
        tooLong: 'a'.repeat(4097),
    },
}

// ── Timestamps ──────────────────────────────────────────────────────────────

export const timestamps = {
    valid: {
        receivedAt: new Date('2025-06-15T10:30:00Z'),
        validatedAt: new Date('2025-06-15T10:35:00Z'),
        mediatedAt: new Date('2025-06-15T10:40:00Z'),
        failedAt: new Date('2025-06-15T10:45:00Z'),
    },
    invalid: {
        string: '2025-01-01',
        number: 1704067200000,
        null: null,
        undefined: undefined,
        invalidDate: new Date('invalid'),
    },
}

// ── Mediation outcomes ──────────────────────────────────────────────────────

const event = new CloudEvent({ type: 'patient.created', source: '/test', id: '1' })

const dispatchedOutcome = {
    result: 'dispatched',
    mediationId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    destination: 'https://downstream.example.com/webhook',
    event,
} satisfies DispatchedOutcome

const skippedOutcome = {
    result: 'skipped',
    mediationId: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    destination: 'https://another.example.com/api',
} satisfies SkippedOutcome

// ── Valid aggregate fixtures (typed per variant) ────────────────────────────

const id = processingId.valid.uuid
const topic = 'patient.created'
const uri = dataschemaUri.valid.https
const { receivedAt, validatedAt, mediatedAt, failedAt } = timestamps.valid

export const valid = {
    received: {
        status: 'received',
        id,
        event,
        topic,
        dataschemaUri: uri,
        receivedAt,
    } satisfies ReceivedProcessing,

    validated: {
        status: 'validated',
        id,
        event,
        topic,
        dataschemaUri: uri,
        receivedAt,
        validatedAt,
    } satisfies ValidatedProcessing,

    mediated: {
        status: 'mediated',
        id,
        event,
        topic,
        dataschemaUri: uri,
        receivedAt,
        validatedAt,
        mediatedAt,
        outcomes: [dispatchedOutcome, skippedOutcome],
    } satisfies MediatedProcessing,

    failed: {
        status: 'failed',
        id,
        event,
        topic,
        dataschemaUri: uri,
        receivedAt,
        failedAt,
        reason: processingFailureReason.valid.descriptive,
    } satisfies FailedProcessing,
}

// ── Invalid aggregate fixtures (intentionally broken) ───────────────────────

export const invalid = {
    null: null,
    string: 'not-an-object',
    emptyObject: {},
    missingStatus: { id, event, topic, dataschemaUri: uri, receivedAt },
    unknownStatus: { status: 'unknown', id, event, topic, dataschemaUri: uri, receivedAt },
    invalidId: { status: 'received', id: 42, event, topic, dataschemaUri: uri, receivedAt },
    missingEvent: { status: 'received', id, topic, dataschemaUri: uri, receivedAt },
    emptyTopic: { status: 'received', id, event, topic: '', dataschemaUri: uri, receivedAt },
}
