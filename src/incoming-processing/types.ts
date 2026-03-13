import { z } from 'zod'
import type { CloudEvent } from 'cloudevents'
import { ProcessingId, MediationId, Topic, Destination } from '../shared/types'
import { Timestamp } from '../shared/primitives'

export type { Result } from '../shared/spec-framework'

// ── Re-exports ──────────────────────────────────────────────────────────────
export { ProcessingId }

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Schema
export const DataschemaUri = z.string().min(1).max(2048)
export type DataschemaUri = z.infer<typeof DataschemaUri>

// Failure reason
export const ProcessingFailureReason = z.string().min(1).max(4096)
export type ProcessingFailureReason = z.infer<typeof ProcessingFailureReason>

// Temporal
export const ReceivedAt = Timestamp
export type ReceivedAt = z.infer<typeof ReceivedAt>

export const ValidatedAt = Timestamp
export type ValidatedAt = z.infer<typeof ValidatedAt>

export const MediatedAt = Timestamp
export type MediatedAt = z.infer<typeof MediatedAt>

export const FailedAt = Timestamp
export type FailedAt = z.infer<typeof FailedAt>

// ── CloudEvent schema ───────────────────────────────────────────────────────

const CloudEventSchema = z.custom<CloudEvent>((v) => typeof v === 'object' && v !== null)

// ── Mediation Outcome ───────────────────────────────────────────────────────

export const DispatchedOutcome = z.object({
  result: z.literal('dispatched'),
  mediationId: MediationId,
  destination: Destination,
  event: CloudEventSchema,
})
export type DispatchedOutcome = z.infer<typeof DispatchedOutcome>

export const SkippedOutcome = z.object({
  result: z.literal('skipped'),
  mediationId: MediationId,
  destination: Destination,
})
export type SkippedOutcome = z.infer<typeof SkippedOutcome>

export const MediationOutcome = z.discriminatedUnion('result', [DispatchedOutcome, SkippedOutcome])
export type MediationOutcome = z.infer<typeof MediationOutcome>

// ── IncomingProcessing Aggregate ────────────────────────────────────────────

export const ReceivedProcessing = z.object({
  status: z.literal('received'),
  id: ProcessingId,
  event: CloudEventSchema,
  topic: Topic,
  dataschemaUri: DataschemaUri,
  receivedAt: ReceivedAt,
})
export type ReceivedProcessing = z.infer<typeof ReceivedProcessing>

export const ValidatedProcessing = z.object({
  status: z.literal('validated'),
  id: ProcessingId,
  event: CloudEventSchema,
  topic: Topic,
  dataschemaUri: DataschemaUri,
  receivedAt: ReceivedAt,
  validatedAt: ValidatedAt,
})
export type ValidatedProcessing = z.infer<typeof ValidatedProcessing>

export const MediatedProcessing = z.object({
  status: z.literal('mediated'),
  id: ProcessingId,
  event: CloudEventSchema,
  topic: Topic,
  dataschemaUri: DataschemaUri,
  receivedAt: ReceivedAt,
  validatedAt: ValidatedAt,
  mediatedAt: MediatedAt,
  outcomes: z.array(MediationOutcome),
})
export type MediatedProcessing = z.infer<typeof MediatedProcessing>

export const FailedProcessing = z.object({
  status: z.literal('failed'),
  id: ProcessingId,
  event: CloudEventSchema,
  topic: Topic,
  dataschemaUri: DataschemaUri,
  receivedAt: ReceivedAt,
  failedAt: FailedAt,
  reason: ProcessingFailureReason,
})
export type FailedProcessing = z.infer<typeof FailedProcessing>

export const IncomingProcessing = z.discriminatedUnion('status', [
  ReceivedProcessing,
  ValidatedProcessing,
  MediatedProcessing,
  FailedProcessing,
])
export type IncomingProcessing = z.infer<typeof IncomingProcessing>
