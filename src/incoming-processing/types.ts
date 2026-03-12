import type { CloudEvent } from 'cloudevents'
import type {
  MediationId,
  Topic,
  Destination,
} from '../shared/types'

export type { Result } from '../shared/spec-framework'

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Identifiers
export type ProcessingId = string
export type ProcessingIdFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_64'
  | 'not_a_uuid'
  | 'script_injection'

// Schema
export type DataschemaUri = string
export type DataschemaUriFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_2048'
  | 'invalid_format_url'
  | 'script_injection'

// Failure reason
export type ProcessingFailureReason = string
export type ProcessingFailureReasonFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_4096'

// Temporal
export type ReceivedAt = Date
export type ReceivedAtFailure = 'not_a_date'

export type ValidatedAt = Date
export type ValidatedAtFailure = 'not_a_date'

export type MediatedAt = Date
export type MediatedAtFailure = 'not_a_date'

export type FailedAt = Date
export type FailedAtFailure = 'not_a_date'

// ── Mediation Outcome ───────────────────────────────────────────────────────

export type DispatchedOutcome = {
  result: 'dispatched'
  mediationId: MediationId
  destination: Destination
  event: CloudEvent
}

export type SkippedOutcome = {
  result: 'skipped'
  mediationId: MediationId
  destination: Destination
}

export type MediationOutcome = DispatchedOutcome | SkippedOutcome

// ── IncomingProcessing Aggregate ────────────────────────────────────────────

export type ReceivedProcessing = {
  status: 'received'
  id: ProcessingId
  event: CloudEvent
  topic: Topic
  dataschemaUri: DataschemaUri
  receivedAt: ReceivedAt
}

export type ValidatedProcessing = {
  status: 'validated'
  id: ProcessingId
  event: CloudEvent
  topic: Topic
  dataschemaUri: DataschemaUri
  receivedAt: ReceivedAt
  validatedAt: ValidatedAt
}

export type MediatedProcessing = {
  status: 'mediated'
  id: ProcessingId
  event: CloudEvent
  topic: Topic
  dataschemaUri: DataschemaUri
  receivedAt: ReceivedAt
  validatedAt: ValidatedAt
  mediatedAt: MediatedAt
  outcomes: MediationOutcome[]
}

export type FailedProcessing = {
  status: 'failed'
  id: ProcessingId
  event: CloudEvent
  topic: Topic
  dataschemaUri: DataschemaUri
  receivedAt: ReceivedAt
  failedAt: FailedAt
  reason: ProcessingFailureReason
}

export type IncomingProcessing =
  | ReceivedProcessing
  | ValidatedProcessing
  | MediatedProcessing
  | FailedProcessing
