// AUTO-GENERATED — do not edit manually.
// Source: types.ts | Generator: scripts/generate-schemas.ts

import { Type, Static } from '@sinclair/typebox'


export type CloudEvent = Static<typeof CloudEvent>
export const CloudEvent = Type.Record(Type.String(), Type.Unknown())

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

export type DataschemaUri = Static<typeof DataschemaUri>
export const DataschemaUri = Type.String({"minLength":1,"maxLength":2048})

export type ProcessingFailureReason = Static<typeof ProcessingFailureReason>
export const ProcessingFailureReason = Type.String({"minLength":1,"maxLength":4096})

export type ReceivedAt = Static<typeof ReceivedAt>
export const ReceivedAt = Timestamp

export type ValidatedAt = Static<typeof ValidatedAt>
export const ValidatedAt = Timestamp

export type MediatedAt = Static<typeof MediatedAt>
export const MediatedAt = Timestamp

export type FailedAt = Static<typeof FailedAt>
export const FailedAt = Timestamp

export type DispatchedOutcome = Static<typeof DispatchedOutcome>
export const DispatchedOutcome = Type.Object({
result: Type.Literal('dispatched'),
mediationId: MediationId,
destination: Destination,
event: CloudEvent
})

export type SkippedOutcome = Static<typeof SkippedOutcome>
export const SkippedOutcome = Type.Object({
result: Type.Literal('skipped'),
mediationId: MediationId,
destination: Destination
})

export type MediationOutcome = Static<typeof MediationOutcome>
export const MediationOutcome = Type.Union([
DispatchedOutcome,
SkippedOutcome
])

export type ReceivedProcessing = Static<typeof ReceivedProcessing>
export const ReceivedProcessing = Type.Object({
status: Type.Literal('received'),
id: ProcessingId,
event: CloudEvent,
topic: Topic,
dataschemaUri: DataschemaUri,
receivedAt: ReceivedAt
})

export type ValidatedProcessing = Static<typeof ValidatedProcessing>
export const ValidatedProcessing = Type.Object({
status: Type.Literal('validated'),
id: ProcessingId,
event: CloudEvent,
topic: Topic,
dataschemaUri: DataschemaUri,
receivedAt: ReceivedAt,
validatedAt: ValidatedAt
})

export type MediatedProcessing = Static<typeof MediatedProcessing>
export const MediatedProcessing = Type.Object({
status: Type.Literal('mediated'),
id: ProcessingId,
event: CloudEvent,
topic: Topic,
dataschemaUri: DataschemaUri,
receivedAt: ReceivedAt,
validatedAt: ValidatedAt,
mediatedAt: MediatedAt,
outcomes: Type.Array(MediationOutcome)
})

export type FailedProcessing = Static<typeof FailedProcessing>
export const FailedProcessing = Type.Object({
status: Type.Literal('failed'),
id: ProcessingId,
event: CloudEvent,
topic: Topic,
dataschemaUri: DataschemaUri,
receivedAt: ReceivedAt,
failedAt: FailedAt,
reason: ProcessingFailureReason
})

export type IncomingProcessing = Static<typeof IncomingProcessing>
export const IncomingProcessing = Type.Union([
ReceivedProcessing,
ValidatedProcessing,
MediatedProcessing,
FailedProcessing
])
