import { z } from 'zod'
import type { CloudEvent } from 'cloudevents'
import { ProcessingId, MediationId, Destination } from '../shared/types'
import { ID, Timestamp } from '../shared/primitives'

export type { Result } from '../shared/spec-framework'

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Identifiers
export const DispatchId = ID
export type DispatchId = z.infer<typeof DispatchId>

// Numeric domain values
export const AttemptCount = z.number().int().min(0)
export type AttemptCount = z.infer<typeof AttemptCount>

export const StatusCode = z.number().int().min(100).max(599)
export type StatusCode = z.infer<typeof StatusCode>

export const ResponseTimeMs = z.number().min(0)
export type ResponseTimeMs = z.infer<typeof ResponseTimeMs>

// Descriptive strings
export const ResponseBody = z.string().max(65536)
export type ResponseBody = z.infer<typeof ResponseBody>

export const DeliveryError = z.string().min(1).max(4096)
export type DeliveryError = z.infer<typeof DeliveryError>

// Structured
export const ResponseHeaders = z.record(z.string(), z.string())
export type ResponseHeaders = z.infer<typeof ResponseHeaders>

// Temporal
export const CreatedAt = Timestamp
export type CreatedAt = z.infer<typeof CreatedAt>

export const DeliveredAt = Timestamp
export type DeliveredAt = z.infer<typeof DeliveredAt>

export const FailedAt = Timestamp
export type FailedAt = z.infer<typeof FailedAt>

export const AttemptedAt = Timestamp
export type AttemptedAt = z.infer<typeof AttemptedAt>

// ── Delivery Attempt ────────────────────────────────────────────────────────

export const SuccessfulAttempt = z.object({
  result: z.literal('successful'),
  attemptedAt: AttemptedAt,
  statusCode: StatusCode,
  responseBody: ResponseBody,
  responseHeaders: ResponseHeaders,
  responseTimeMs: ResponseTimeMs,
})
export type SuccessfulAttempt = z.infer<typeof SuccessfulAttempt>

export const FailedAttempt = z.object({
  result: z.literal('failed'),
  attemptedAt: AttemptedAt,
  statusCode: StatusCode,
  responseBody: ResponseBody,
  responseHeaders: ResponseHeaders,
  responseTimeMs: ResponseTimeMs,
  error: DeliveryError,
})
export type FailedAttempt = z.infer<typeof FailedAttempt>

export const DeliveryAttempt = z.discriminatedUnion('result', [SuccessfulAttempt, FailedAttempt])
export type DeliveryAttempt = z.infer<typeof DeliveryAttempt>

// ── Dispatch Aggregate ──────────────────────────────────────────────────────

const CloudEventSchema = z.custom<CloudEvent>((v) => typeof v === 'object' && v !== null)

export const ToDeliverDispatch = z.object({
  status: z.literal('to-deliver'),
  id: DispatchId,
  processingId: ProcessingId,
  mediationId: MediationId,
  destination: Destination,
  event: CloudEventSchema,
  createdAt: CreatedAt,
})
export type ToDeliverDispatch = z.infer<typeof ToDeliverDispatch>

export const AttemptedDispatch = z.object({
  status: z.literal('attempted'),
  id: DispatchId,
  processingId: ProcessingId,
  mediationId: MediationId,
  destination: Destination,
  event: CloudEventSchema,
  createdAt: CreatedAt,
  attempts: z.array(DeliveryAttempt),
  attemptCount: AttemptCount,
})
export type AttemptedDispatch = z.infer<typeof AttemptedDispatch>

export const DeliveredDispatch = z.object({
  status: z.literal('delivered'),
  id: DispatchId,
  processingId: ProcessingId,
  mediationId: MediationId,
  destination: Destination,
  event: CloudEventSchema,
  createdAt: CreatedAt,
  attempts: z.array(DeliveryAttempt),
  attemptCount: AttemptCount,
  deliveredAt: DeliveredAt,
})
export type DeliveredDispatch = z.infer<typeof DeliveredDispatch>

export const FailedDispatch = z.object({
  status: z.literal('failed'),
  id: DispatchId,
  processingId: ProcessingId,
  mediationId: MediationId,
  destination: Destination,
  event: CloudEventSchema,
  createdAt: CreatedAt,
  attempts: z.array(DeliveryAttempt),
  attemptCount: AttemptCount,
  failedAt: FailedAt,
})
export type FailedDispatch = z.infer<typeof FailedDispatch>

export const Dispatch = z.discriminatedUnion('status', [
  ToDeliverDispatch,
  AttemptedDispatch,
  DeliveredDispatch,
  FailedDispatch,
])
export type Dispatch = z.infer<typeof Dispatch>
