import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type {
    DeliveredDispatch,
    AttemptedDispatch,
    FailedDispatch,
    ToDeliverDispatch,
    Dispatch,
    SuccessfulAttempt,
    FailedAttempt,
} from '../types'
import type { DomainDeps } from '../../domain-deps'
import { recordDeliverySpec } from './core/record-delivery.spec'
import { CloudEvent } from 'cloudevents'

type ShellInput = {
    cmd: {
        dispatchId: string
    }
}

export type RecordDeliveryOutput = DeliveredDispatch | AttemptedDispatch | FailedDispatch

export type RecordDeliveryShellFn = SpecFn<
    ShellInput,
    RecordDeliveryOutput,
    | 'not_found'
    | 'already_terminal',
    'delivered' | 'attempt-recorded' | 'max-attempts-exhausted'
>

const steps: StepInfo[] = [
    { name: 'getDispatchById', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'deliver', type: 'dep', description: 'Attempt HTTP delivery to destination, returns DeliveryAttempt' },
    { name: 'getMaxAttempts', type: 'dep', description: 'Retrieve the max attempts configuration' },
    { name: 'recordDeliveryCore', type: 'step', description: 'Evaluate attempt result, transition state accordingly', spec: asStepSpec(recordDeliverySpec) },
    { name: 'upsertDispatch', type: 'dep', description: 'Persist the updated aggregate' },
]

// ── Test fixtures ────────────────────────────────────────────────────────

const notFoundId = 'a0000000-0000-0000-0000-000000000001'
const successId = 'b0000000-0000-0000-0000-000000000001'
const failRetryId = 'c0000000-0000-0000-0000-000000000001'
const failMaxId = 'd0000000-0000-0000-0000-000000000002'

const processingId = '7ba7b810-9dad-11d1-80b4-00c04fd430c8'
const mediationId = '8ba7b810-9dad-11d1-80b4-00c04fd430c8'
const destination = 'https://downstream.example.com/webhook'
const event = new CloudEvent({ type: 'patient.created', source: '/test', id: '1' })
const createdAt = new Date('2025-06-15T10:30:00Z')

const successfulAttempt: SuccessfulAttempt = {
    result: 'successful',
    attemptedAt: new Date('2025-06-15T10:31:00Z'),
    statusCode: 200,
    responseBody: '{"status":"ok"}',
    responseHeaders: { 'content-type': 'application/json' },
    responseTimeMs: 150,
}

const failedAttempt: FailedAttempt = {
    result: 'failed',
    attemptedAt: new Date('2025-06-15T10:31:00Z'),
    statusCode: 503,
    responseBody: 'Service Unavailable',
    responseHeaders: {},
    responseTimeMs: 5000,
    error: 'ETIMEDOUT: connection timed out',
}

const previousFailedAttempt: FailedAttempt = {
    result: 'failed',
    attemptedAt: new Date('2025-06-15T10:30:30Z'),
    statusCode: 502,
    responseBody: 'Bad Gateway',
    responseHeaders: {},
    responseTimeMs: 3000,
    error: 'upstream error',
}

const mkToDeliver = (id: string): ToDeliverDispatch => ({
    status: 'to-deliver', id, processingId, mediationId, destination, event, createdAt,
})

const attemptedAt2: AttemptedDispatch = {
    status: 'attempted',
    id: failMaxId,
    processingId, mediationId, destination, event, createdAt,
    attempts: [previousFailedAttempt, previousFailedAttempt],
    attemptCount: 2,
}

// ── Test deps ────────────────────────────────────────────────────────────

export type RecordDeliveryDeps = Pick<DomainDeps, 'getDispatchById' | 'deliver' | 'getMaxAttempts' | 'upsertDispatch'>

const dispatchStore: Record<string, Dispatch> = {
    [successId]: mkToDeliver(successId),
    [failRetryId]: mkToDeliver(failRetryId),
    [failMaxId]: attemptedAt2,
}

export const testDeps: RecordDeliveryDeps = {
    getDispatchById: async (id) =>
        id in dispatchStore
            ? { ok: true, value: dispatchStore[id], successType: ['found'] }
            : { ok: true, value: null, successType: ['not-found'] },
    deliver: async (dispatch) =>
        dispatch.id === successId
            ? { ok: true, value: successfulAttempt, successType: ['delivery-successful'] as ('delivery-successful' | 'delivery-failed')[] }
            : { ok: true, value: failedAttempt, successType: ['delivery-failed'] as ('delivery-successful' | 'delivery-failed')[] },
    getMaxAttempts: async () => ({ ok: true, value: 3, successType: ['resolved'] as 'resolved'[] }),
    upsertDispatch: async () => ({ ok: true, value: undefined, successType: ['upserted'] as 'upserted'[] }),
}

// ── Spec ─────────────────────────────────────────────────────────────────

export const recordDeliveryShellSpec: Spec<RecordDeliveryShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        not_found: {
            description: 'No dispatch aggregate exists for this ID',
            examples: [
                {
                    description: 'rejects when dispatch not found',
                    whenInput: { cmd: { dispatchId: notFoundId } },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'delivered': {
            description: 'Delivery succeeded, dispatch marked as delivered',
            examples: [
                {
                    description: 'first attempt succeeds',
                    whenInput: { cmd: { dispatchId: successId } },
                    then: {
                        status: 'delivered',
                        id: successId,
                        processingId, mediationId, destination, event, createdAt,
                        attempts: [successfulAttempt],
                        attemptCount: 1,
                        deliveredAt: successfulAttempt.attemptedAt,
                    },
                },
            ],
        },
        'attempt-recorded': {
            description: 'Delivery failed but retries remain, attempt recorded',
            examples: [
                {
                    description: 'first attempt fails, retries remain',
                    whenInput: { cmd: { dispatchId: failRetryId } },
                    then: {
                        status: 'attempted',
                        id: failRetryId,
                        processingId, mediationId, destination, event, createdAt,
                        attempts: [failedAttempt],
                        attemptCount: 1,
                    },
                },
            ],
        },
        'max-attempts-exhausted': {
            description: 'Delivery failed and max retries reached, dispatch marked as failed',
            examples: [
                {
                    description: 'third attempt fails, max reached',
                    whenInput: { cmd: { dispatchId: failMaxId } },
                    then: {
                        status: 'failed',
                        id: failMaxId,
                        processingId, mediationId, destination, event, createdAt,
                        attempts: [previousFailedAttempt, previousFailedAttempt, failedAttempt],
                        attemptCount: 3,
                        failedAt: failedAttempt.attemptedAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'delivered': {},
        'attempt-recorded': {},
        'max-attempts-exhausted': {},
    },
}
