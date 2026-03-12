import type { CloudEvent } from 'cloudevents'
import type {
  ProcessingId,
  MediationId,
  Destination,
} from '../shared/types'

export type { Result } from '../shared/spec-framework'

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Identifiers
export type DispatchId = string
export type DispatchIdFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_64'
  | 'not_a_uuid'
  | 'script_injection'

// Numeric domain values
export type AttemptCount = number
export type AttemptCountFailure =
  | 'not_a_number'
  | 'not_an_integer'
  | 'negative'

export type StatusCode = number
export type StatusCodeFailure =
  | 'not_a_number'
  | 'not_an_integer'
  | 'out_of_range_min_100_max_599'

export type ResponseTimeMs = number
export type ResponseTimeMsFailure =
  | 'not_a_number'
  | 'negative'

// Descriptive strings
export type ResponseBody = string
export type ResponseBodyFailure =
  | 'not_a_string'
  | 'too_long_max_65536'

export type DeliveryError = string
export type DeliveryErrorFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_4096'

// Structured
export type ResponseHeaders = Record<string, string>
export type ResponseHeadersFailure =
  | 'not_an_object'

// Temporal
export type CreatedAt = Date
export type CreatedAtFailure = 'not_a_date'

export type DeliveredAt = Date
export type DeliveredAtFailure = 'not_a_date'

export type FailedAt = Date
export type FailedAtFailure = 'not_a_date'

export type AttemptedAt = Date
export type AttemptedAtFailure = 'not_a_date'

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
