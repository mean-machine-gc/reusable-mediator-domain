import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type {
    DispatchId,
    Dispatch,
    ToDeliverDispatch,
    AttemptedDispatch,
    DeliveredDispatch,
    FailedDispatch,
    DeliveryAttempt,
    SuccessfulAttempt,
    FailedAttempt,
} from '../../types'

// ── Input ────────────────────────────────────────────────────────────────────

export type RecordDeliveryCmd = {
    dispatchId: DispatchId
}

export type RecordDeliveryState = Dispatch

export type RecordDeliveryCtx = {
    attempt: DeliveryAttempt
    maxAttempts: number
}

export type RecordDeliveryInput = {
    cmd: RecordDeliveryCmd
    state: RecordDeliveryState
    ctx: RecordDeliveryCtx
}

// ── Output ───────────────────────────────────────────────────────────────────

export type RecordDeliveryOutput = DeliveredDispatch | AttemptedDispatch | FailedDispatch

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type RecordDeliveryFn = SpecFn<
    RecordDeliveryInput,
    RecordDeliveryOutput,
    'already_terminal',
    'delivered' | 'attempt-recorded' | 'max-attempts-exhausted'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const event = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active', routed: true },
} as unknown as CloudEvent

const dispatchId = 'a0000000-0000-0000-0000-000000000001'
const processingId = '550e8400-e29b-41d4-a716-446655440000'
const mediationId = '00000000-0000-0000-0000-000000000001'
const destination = 'https://shr.example.com/fhir'
const createdAt = new Date('2025-06-15T10:31:00Z')

const successfulAttempt: SuccessfulAttempt = {
    result: 'successful',
    attemptedAt: new Date('2025-06-15T10:31:01Z'),
    statusCode: 200,
    responseBody: '{"status":"ok"}',
    responseHeaders: { 'content-type': 'application/json' },
    responseTimeMs: 120,
}

const failedAttempt: FailedAttempt = {
    result: 'failed',
    attemptedAt: new Date('2025-06-15T10:31:01Z'),
    statusCode: 503,
    responseBody: 'Service Unavailable',
    responseHeaders: {},
    responseTimeMs: 5000,
    error: 'ETIMEDOUT: connection timed out',
}

const previousFailedAttempt: FailedAttempt = {
    result: 'failed',
    attemptedAt: new Date('2025-06-15T10:31:00Z'),
    statusCode: 502,
    responseBody: 'Bad Gateway',
    responseHeaders: {},
    responseTimeMs: 3000,
    error: 'upstream error',
}

const toDeliverState: ToDeliverDispatch = {
    status: 'to-deliver',
    id: dispatchId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt,
}

const attemptedState: AttemptedDispatch = {
    status: 'attempted',
    id: dispatchId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt,
    attempts: [previousFailedAttempt],
    attemptCount: 1,
}

const attemptedAtMaxMinus1: AttemptedDispatch = {
    status: 'attempted',
    id: dispatchId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt,
    attempts: [previousFailedAttempt, previousFailedAttempt],
    attemptCount: 2,
}

const deliveredState: DeliveredDispatch = {
    status: 'delivered',
    id: dispatchId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt,
    attempts: [successfulAttempt],
    attemptCount: 1,
    deliveredAt: new Date('2025-06-15T10:31:01Z'),
}

const failedState: FailedDispatch = {
    status: 'failed',
    id: dispatchId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt,
    attempts: [previousFailedAttempt, previousFailedAttempt, previousFailedAttempt],
    attemptCount: 3,
    failedAt: new Date('2025-06-15T10:31:03Z'),
}

// ── Spec ─────────────────────────────────────────────────────────────────────

export const recordDeliverySpec: Spec<RecordDeliveryFn> = {
    shouldFailWith: {
        already_terminal: {
            description: 'Dispatch is already in a terminal state',
            examples: [
                {
                    description: 'rejects already delivered dispatch',
                    whenInput: {
                        cmd: { dispatchId },
                        state: deliveredState,
                        ctx: { attempt: successfulAttempt, maxAttempts: 3 },
                    },
                },
                {
                    description: 'rejects already failed dispatch',
                    whenInput: {
                        cmd: { dispatchId },
                        state: failedState,
                        ctx: { attempt: failedAttempt, maxAttempts: 3 },
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'delivered': {
            description: 'Delivery attempt succeeded, dispatch transitions to delivered',
            examples: [
                {
                    description: 'first attempt succeeds on to-deliver dispatch',
                    whenInput: {
                        cmd: { dispatchId },
                        state: toDeliverState,
                        ctx: { attempt: successfulAttempt, maxAttempts: 3 },
                    },
                    then: {
                        status: 'delivered',
                        id: dispatchId,
                        processingId,
                        mediationId,
                        destination,
                        event,
                        createdAt,
                        attempts: [successfulAttempt],
                        attemptCount: 1,
                        deliveredAt: successfulAttempt.attemptedAt,
                    },
                },
                {
                    description: 'retry succeeds on attempted dispatch',
                    whenInput: {
                        cmd: { dispatchId },
                        state: attemptedState,
                        ctx: { attempt: successfulAttempt, maxAttempts: 3 },
                    },
                    then: {
                        status: 'delivered',
                        id: dispatchId,
                        processingId,
                        mediationId,
                        destination,
                        event,
                        createdAt,
                        attempts: [previousFailedAttempt, successfulAttempt],
                        attemptCount: 2,
                        deliveredAt: successfulAttempt.attemptedAt,
                    },
                },
            ],
        },
        'attempt-recorded': {
            description: 'Delivery attempt failed but retry is still possible',
            examples: [
                {
                    description: 'first attempt fails on to-deliver dispatch (max 3)',
                    whenInput: {
                        cmd: { dispatchId },
                        state: toDeliverState,
                        ctx: { attempt: failedAttempt, maxAttempts: 3 },
                    },
                    then: {
                        status: 'attempted',
                        id: dispatchId,
                        processingId,
                        mediationId,
                        destination,
                        event,
                        createdAt,
                        attempts: [failedAttempt],
                        attemptCount: 1,
                    },
                },
            ],
        },
        'max-attempts-exhausted': {
            description: 'Delivery attempt failed and max retries reached',
            examples: [
                {
                    description: 'third attempt fails on attempted dispatch (max 3)',
                    whenInput: {
                        cmd: { dispatchId },
                        state: attemptedAtMaxMinus1,
                        ctx: { attempt: failedAttempt, maxAttempts: 3 },
                    },
                    then: {
                        status: 'failed',
                        id: dispatchId,
                        processingId,
                        mediationId,
                        destination,
                        event,
                        createdAt,
                        attempts: [previousFailedAttempt, previousFailedAttempt, failedAttempt],
                        attemptCount: 3,
                        failedAt: failedAttempt.attemptedAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'delivered': {
            'status-is-delivered': {
                description: 'Output status is delivered',
                assert: (_input, output) => output.status === 'delivered',
            },
            'attempt-appended': {
                description: 'The new attempt is appended to the attempts list',
                assert: (input, output) => output.attempts[output.attempts.length - 1] === input.ctx.attempt,
            },
            'count-incremented': {
                description: 'Attempt count is previous count plus one',
                assert: (input, output) => {
                    const prev = input.state.status === 'attempted' ? input.state.attemptCount : 0
                    return output.attemptCount === prev + 1
                },
            },
            'attempts-length-matches-count': {
                description: 'Attempts array length equals attempt count',
                assert: (_input, output) => output.attempts.length === output.attemptCount,
            },
            'deliveredAt-from-attempt': {
                description: 'DeliveredAt equals the successful attempt timestamp',
                assert: (input, output) => output.status === 'delivered' && output.deliveredAt === input.ctx.attempt.attemptedAt,
            },
        },
        'attempt-recorded': {
            'status-is-attempted': {
                description: 'Output status is attempted',
                assert: (_input, output) => output.status === 'attempted',
            },
            'attempt-appended': {
                description: 'The new attempt is appended to the attempts list',
                assert: (input, output) => output.attempts[output.attempts.length - 1] === input.ctx.attempt,
            },
            'count-incremented': {
                description: 'Attempt count is previous count plus one',
                assert: (input, output) => {
                    const prev = input.state.status === 'attempted' ? input.state.attemptCount : 0
                    return output.attemptCount === prev + 1
                },
            },
            'attempts-length-matches-count': {
                description: 'Attempts array length equals attempt count',
                assert: (_input, output) => output.attempts.length === output.attemptCount,
            },
            'count-below-max': {
                description: 'Attempt count is below max attempts',
                assert: (input, output) => output.status === 'attempted' && output.attemptCount < input.ctx.maxAttempts,
            },
        },
        'max-attempts-exhausted': {
            'status-is-failed': {
                description: 'Output status is failed',
                assert: (_input, output) => output.status === 'failed',
            },
            'attempt-appended': {
                description: 'The new attempt is appended to the attempts list',
                assert: (input, output) => output.attempts[output.attempts.length - 1] === input.ctx.attempt,
            },
            'count-incremented': {
                description: 'Attempt count is previous count plus one',
                assert: (input, output) => {
                    const prev = input.state.status === 'attempted' ? input.state.attemptCount : 0
                    return output.attemptCount === prev + 1
                },
            },
            'attempts-length-matches-count': {
                description: 'Attempts array length equals attempt count',
                assert: (_input, output) => output.attempts.length === output.attemptCount,
            },
            'count-equals-max': {
                description: 'Attempt count equals max attempts',
                assert: (input, output) => output.status === 'failed' && output.attemptCount === input.ctx.maxAttempts,
            },
        },
    },
}
