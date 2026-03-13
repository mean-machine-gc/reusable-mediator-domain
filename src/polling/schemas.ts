// AUTO-GENERATED — do not edit manually.
// Source: types.ts | Generator: scripts/generate-schemas.ts

import { Type, Static } from '@sinclair/typebox'
import { CloudEvent } from '../incoming-processing/schemas'


export type ID = Static<typeof ID>
export const ID = Type.String({"minLength":1,"maxLength":64,"pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"})

export type Timestamp = Static<typeof Timestamp>
export const Timestamp = Type.Date()

export type ProcessingId = Static<typeof ProcessingId>
export const ProcessingId = ID

export type MediationId = Static<typeof MediationId>
export const MediationId = ID

export type Topic = Static<typeof Topic>
export const Topic = Type.String({"minLength":2,"maxLength":256})

export type Destination = Static<typeof Destination>
export const Destination = Type.String({"minLength":1,"maxLength":2048})

export type DispatchId = Static<typeof DispatchId>
export const DispatchId = ID

export type AttemptCount = Static<typeof AttemptCount>
export const AttemptCount = Type.Integer({"minimum":0})

export type StatusCode = Static<typeof StatusCode>
export const StatusCode = Type.Integer({"minimum":100,"maximum":599})

export type ResponseTimeMs = Static<typeof ResponseTimeMs>
export const ResponseTimeMs = Type.Number({"minimum":0})

export type ResponseBody = Static<typeof ResponseBody>
export const ResponseBody = Type.String({"maxLength":65536})

export type DeliveryError = Static<typeof DeliveryError>
export const DeliveryError = Type.String({"minLength":1,"maxLength":4096})

export type ResponseHeaders = Static<typeof ResponseHeaders>
export const ResponseHeaders = Type.Record(Type.String(), Type.String())

export type CreatedAt = Static<typeof CreatedAt>
export const CreatedAt = Timestamp

export type DeliveredAt = Static<typeof DeliveredAt>
export const DeliveredAt = Timestamp

export type FailedAt = Static<typeof FailedAt>
export const FailedAt = Timestamp

export type AttemptedAt = Static<typeof AttemptedAt>
export const AttemptedAt = Timestamp

export type SuccessfulAttempt = Static<typeof SuccessfulAttempt>
export const SuccessfulAttempt = Type.Object({
result: Type.Literal('successful'),
attemptedAt: AttemptedAt,
statusCode: StatusCode,
responseBody: ResponseBody,
responseHeaders: ResponseHeaders,
responseTimeMs: ResponseTimeMs
})

export type FailedAttempt = Static<typeof FailedAttempt>
export const FailedAttempt = Type.Object({
result: Type.Literal('failed'),
attemptedAt: AttemptedAt,
statusCode: StatusCode,
responseBody: ResponseBody,
responseHeaders: ResponseHeaders,
responseTimeMs: ResponseTimeMs,
error: DeliveryError
})

export type DeliveryAttempt = Static<typeof DeliveryAttempt>
export const DeliveryAttempt = Type.Union([
SuccessfulAttempt,
FailedAttempt
])

export type ToDeliverDispatch = Static<typeof ToDeliverDispatch>
export const ToDeliverDispatch = Type.Object({
status: Type.Literal('to-deliver'),
id: DispatchId,
processingId: ProcessingId,
mediationId: MediationId,
destination: Destination,
event: CloudEvent,
createdAt: CreatedAt
})

export type AttemptedDispatch = Static<typeof AttemptedDispatch>
export const AttemptedDispatch = Type.Object({
status: Type.Literal('attempted'),
id: DispatchId,
processingId: ProcessingId,
mediationId: MediationId,
destination: Destination,
event: CloudEvent,
createdAt: CreatedAt,
attempts: Type.Array(DeliveryAttempt),
attemptCount: AttemptCount
})

export type DeliveredDispatch = Static<typeof DeliveredDispatch>
export const DeliveredDispatch = Type.Object({
status: Type.Literal('delivered'),
id: DispatchId,
processingId: ProcessingId,
mediationId: MediationId,
destination: Destination,
event: CloudEvent,
createdAt: CreatedAt,
attempts: Type.Array(DeliveryAttempt),
attemptCount: AttemptCount,
deliveredAt: DeliveredAt
})

export type FailedDispatch = Static<typeof FailedDispatch>
export const FailedDispatch = Type.Object({
status: Type.Literal('failed'),
id: DispatchId,
processingId: ProcessingId,
mediationId: MediationId,
destination: Destination,
event: CloudEvent,
createdAt: CreatedAt,
attempts: Type.Array(DeliveryAttempt),
attemptCount: AttemptCount,
failedAt: FailedAt
})

export type Dispatch = Static<typeof Dispatch>
export const Dispatch = Type.Union([
ToDeliverDispatch,
AttemptedDispatch,
DeliveredDispatch,
FailedDispatch
])

export type ValidationEntry = Static<typeof ValidationEntry>
export const ValidationEntry = Type.Object({
processingId: ProcessingId
})

export type ValidationFailureEntry = Static<typeof ValidationFailureEntry>
export const ValidationFailureEntry = Type.Object({
processingId: ProcessingId,
errors: Type.Array(Type.String())
})

export type PollReceivedResult = Static<typeof PollReceivedResult>
export const PollReceivedResult = Type.Object({
validated: Type.Array(ValidationEntry),
failed: Type.Array(ValidationFailureEntry)
})

export type MediatedEntry = Static<typeof MediatedEntry>
export const MediatedEntry = Type.Object({
processingId: ProcessingId,
dispatches: Type.Array(Type.Object({
dispatchId: DispatchId,
destination: Destination
})),
skipped: Type.Array(MediationId)
})

export type MediationFailureEntry = Static<typeof MediationFailureEntry>
export const MediationFailureEntry = Type.Object({
processingId: ProcessingId,
errors: Type.Array(Type.String())
})

export type PollValidatedResult = Static<typeof PollValidatedResult>
export const PollValidatedResult = Type.Object({
mediated: Type.Array(MediatedEntry),
failed: Type.Array(MediationFailureEntry)
})

export type PollDispatchesResult = Static<typeof PollDispatchesResult>
export const PollDispatchesResult = Type.Object({
delivered: Type.Array(DispatchId),
retrying: Type.Array(DispatchId),
exhausted: Type.Array(DispatchId)
})
