import { CloudEvent } from 'cloudevents'
import type {
    ToDeliverDispatch,
    AttemptedDispatch,
    DeliveredDispatch,
    FailedDispatch,
    SuccessfulAttempt,
    FailedAttempt,
} from './types'

// ── DispatchId ─────────────────────────────────────────────────────────────

export const dispatchId = {
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

// ── AttemptCount ───────────────────────────────────────────────────────────

export const attemptCount = {
    valid: {
        zero: 0,
        three: 3,
    },
    invalid: {
        string: 'three',
        null: null,
        undefined: undefined,
        nan: NaN,
        float: 2.5,
        negative: -1,
    },
}

// ── StatusCode ─────────────────────────────────────────────────────────────

export const statusCode = {
    valid: {
        ok: 200,
        serviceUnavailable: 503,
    },
    invalid: {
        string: '200',
        null: null,
        nan: NaN,
        float: 200.5,
        belowRange: 99,
        aboveRange: 600,
    },
}

// ── ResponseTimeMs ─────────────────────────────────────────────────────────

export const responseTimeMs = {
    valid: {
        zero: 0,
        fractional: 150.5,
    },
    invalid: {
        string: 'fast',
        null: null,
        nan: NaN,
        negative: -50,
    },
}

// ── ResponseBody ───────────────────────────────────────────────────────────

export const responseBody = {
    valid: {
        empty: '',
        json: '{"status":"ok"}',
    },
    invalid: {
        number: 42,
        null: null,
        object: { body: 'ok' },
        tooLong: 'a'.repeat(65537),
    },
}

// ── DeliveryError ──────────────────────────────────────────────────────────

export const deliveryError = {
    valid: {
        timeout: 'ETIMEDOUT: connection timed out',
        connectionRefused: 'ECONNREFUSED: connection refused',
    },
    invalid: {
        number: 42,
        null: null,
        object: { error: 'timeout' },
        empty: '',
        tooLong: 'a'.repeat(4097),
    },
}

// ── ResponseHeaders ────────────────────────────────────────────────────────

export const responseHeaders = {
    valid: {
        typical: { 'content-type': 'application/json', 'x-request-id': 'abc-123' },
        empty: {},
    },
    invalid: {
        string: 'content-type: json',
        number: 42,
        null: null,
        array: ['content-type', 'json'],
    },
}

// ── Timestamps ─────────────────────────────────────────────────────────────

export const timestamps = {
    valid: {
        createdAt: new Date('2025-06-15T10:30:00Z'),
        attemptedAt: new Date('2025-06-15T10:30:03Z'),
        deliveredAt: new Date('2025-06-15T10:30:05Z'),
        failedAt: new Date('2025-06-15T10:30:10Z'),
    },
    invalid: {
        string: '2025-01-01',
        number: 1704067200000,
        null: null,
        undefined: undefined,
        invalidDate: new Date('invalid'),
    },
}

// ── DeliveryAttempt ────────────────────────────────────────────────────────

export const successfulAttempt = {
    result: 'successful',
    attemptedAt: timestamps.valid.attemptedAt,
    statusCode: 200,
    responseBody: '{"status":"ok"}',
    responseHeaders: { 'content-type': 'application/json' },
    responseTimeMs: 150,
} satisfies SuccessfulAttempt

export const failedAttempt = {
    result: 'failed',
    attemptedAt: timestamps.valid.attemptedAt,
    statusCode: 503,
    responseBody: 'Service Unavailable',
    responseHeaders: {},
    responseTimeMs: 5000,
    error: 'ETIMEDOUT: connection timed out',
} satisfies FailedAttempt

// ── Valid aggregate fixtures ───────────────────────────────────────────────

const id = dispatchId.valid.uuid
export const processingId = '7ba7b810-9dad-11d1-80b4-00c04fd430c8'
const mediationId = '8ba7b810-9dad-11d1-80b4-00c04fd430c8'
const destination = 'https://downstream.example.com/webhook'
export { mediationId as mediationIdFixture, destination as destinationFixture }
export const event = new CloudEvent({ type: 'patient.created', source: '/test', id: '1' })
const { createdAt, deliveredAt, failedAt } = timestamps.valid

export const valid = {
    toDeliver: {
        status: 'to-deliver',
        id,
        processingId,
        mediationId,
        destination,
        event,
        createdAt,
    } satisfies ToDeliverDispatch,

    attempted: {
        status: 'attempted',
        id,
        processingId,
        mediationId,
        destination,
        event,
        createdAt,
        attempts: [failedAttempt],
        attemptCount: 1,
    } satisfies AttemptedDispatch,

    delivered: {
        status: 'delivered',
        id,
        processingId,
        mediationId,
        destination,
        event,
        createdAt,
        attempts: [successfulAttempt],
        attemptCount: 1,
        deliveredAt,
    } satisfies DeliveredDispatch,

    failed: {
        status: 'failed',
        id,
        processingId,
        mediationId,
        destination,
        event,
        createdAt,
        attempts: [failedAttempt, failedAttempt, failedAttempt],
        attemptCount: 3,
        failedAt,
    } satisfies FailedDispatch,
}

// ── Invalid aggregate fixtures ─────────────────────────────────────────────

export const invalid = {
    null: null,
    string: 'not-an-object',
    emptyObject: {},
    missingStatus: { id, processingId, mediationId, destination, event, createdAt },
    unknownStatus: { status: 'unknown', id, processingId, mediationId, destination, event, createdAt },
    invalidId: { status: 'to-deliver', id: 42, processingId, mediationId, destination, event, createdAt },
    missingEvent: { status: 'to-deliver', id, processingId, mediationId, destination, createdAt },
    invalidAttemptCount: { status: 'attempted', id, processingId, mediationId, destination, event, createdAt, attempts: [], attemptCount: -1 },
}
