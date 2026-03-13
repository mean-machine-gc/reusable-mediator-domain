import type { CloudEvent } from 'cloudevents'
import type {
  ProcessingId, ProcessingIdValidations,
  MediationId,
  Topic,
  Destination,
} from '../shared/types'
import type { Timestamp, TimestampValidations } from '../shared/primitives'

export type { Result } from '../shared/spec-framework'

// ── Shared Domain Primitives (re-exported) ──────────────────────────────────
export type { ProcessingId, ProcessingIdValidations }

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Schema
/**
 * @minLength 1
 * @maxLength 2048
 */
export type DataschemaUri = string
export type DataschemaUriValidations =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_2048'
  | 'invalid_format_url'
  | 'script_injection'

// Failure reason
/**
 * @minLength 1
 * @maxLength 4096
 */
export type ProcessingFailureReason = string
export type ProcessingFailureReasonValidations =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_4096'

// Temporal
export type ReceivedAt = Timestamp
export type ReceivedAtValidations = TimestampValidations

export type ValidatedAt = Timestamp
export type ValidatedAtValidations = TimestampValidations

export type MediatedAt = Timestamp
export type MediatedAtValidations = TimestampValidations

export type FailedAt = Timestamp
export type FailedAtValidations = TimestampValidations

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
