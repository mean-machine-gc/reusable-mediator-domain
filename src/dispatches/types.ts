import type { CloudEvent } from 'cloudevents'
import type {
  ProcessingId,
  MediationId,
  Destination,
} from '../shared/types'
import type { ID, IDValidations, Timestamp, TimestampValidations } from '../shared/primitives'

export type { Result } from '../shared/spec-framework'

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Identifiers
export type DispatchId = ID
export type DispatchIdValidations = IDValidations

// Numeric domain values
/**
 * @minimum 0
 * @type integer
 */
export type AttemptCount = number
export type AttemptCountValidations =
  | 'not_a_number'
  | 'not_an_integer'
  | 'negative'

/**
 * @minimum 100
 * @maximum 599
 * @type integer
 */
export type StatusCode = number
export type StatusCodeValidations =
  | 'not_a_number'
  | 'not_an_integer'
  | 'out_of_range_min_100_max_599'

/**
 * @minimum 0
 */
export type ResponseTimeMs = number
export type ResponseTimeMsValidations =
  | 'not_a_number'
  | 'negative'

// Descriptive strings
/**
 * @maxLength 65536
 */
export type ResponseBody = string
export type ResponseBodyValidations =
  | 'not_a_string'
  | 'too_long_max_65536'

/**
 * @minLength 1
 * @maxLength 4096
 */
export type DeliveryError = string
export type DeliveryErrorValidations =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_4096'

// Structured
export type ResponseHeaders = Record<string, string>
export type ResponseHeadersValidations =
  | 'not_an_object'

// Temporal
export type CreatedAt = Timestamp
export type CreatedAtValidations = TimestampValidations

export type DeliveredAt = Timestamp
export type DeliveredAtValidations = TimestampValidations

export type FailedAt = Timestamp
export type FailedAtValidations = TimestampValidations

export type AttemptedAt = Timestamp
export type AttemptedAtValidations = TimestampValidations

// ── Delivery Attempt ────────────────────────────────────────────────────────

export type SuccessfulAttempt = {
  result: 'successful'
  attemptedAt: AttemptedAt
  statusCode: StatusCode
  responseBody: ResponseBody
  responseHeaders: ResponseHeaders
  responseTimeMs: ResponseTimeMs
}

export type FailedAttempt = {
  result: 'failed'
  attemptedAt: AttemptedAt
  statusCode: StatusCode
  responseBody: ResponseBody
  responseHeaders: ResponseHeaders
  responseTimeMs: ResponseTimeMs
  error: DeliveryError
}

export type DeliveryAttempt = SuccessfulAttempt | FailedAttempt

// ── Dispatch Aggregate ──────────────────────────────────────────────────────

export type ToDeliverDispatch = {
  status: 'to-deliver'
  id: DispatchId
  processingId: ProcessingId
  mediationId: MediationId
  destination: Destination
  event: CloudEvent
  createdAt: CreatedAt
}

export type AttemptedDispatch = {
  status: 'attempted'
  id: DispatchId
  processingId: ProcessingId
  mediationId: MediationId
  destination: Destination
  event: CloudEvent
  createdAt: CreatedAt
  attempts: DeliveryAttempt[]
  attemptCount: AttemptCount
}

export type DeliveredDispatch = {
  status: 'delivered'
  id: DispatchId
  processingId: ProcessingId
  mediationId: MediationId
  destination: Destination
  event: CloudEvent
  createdAt: CreatedAt
  attempts: DeliveryAttempt[]
  attemptCount: AttemptCount
  deliveredAt: DeliveredAt
}

export type FailedDispatch = {
  status: 'failed'
  id: DispatchId
  processingId: ProcessingId
  mediationId: MediationId
  destination: Destination
  event: CloudEvent
  createdAt: CreatedAt
  attempts: DeliveryAttempt[]
  attemptCount: AttemptCount
  failedAt: FailedAt
}

export type Dispatch = ToDeliverDispatch | AttemptedDispatch | DeliveredDispatch | FailedDispatch
