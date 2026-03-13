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

export type FieldPath = Static<typeof FieldPath>
export const FieldPath = Type.String({"minLength":1,"maxLength":512})

export type RegexPattern = Static<typeof RegexPattern>
export const RegexPattern = Type.String({"minLength":1,"maxLength":1024})

export type CreatedAt = Static<typeof CreatedAt>
export const CreatedAt = Timestamp

export type ActivatedAt = Static<typeof ActivatedAt>
export const ActivatedAt = Timestamp

export type DeactivatedAt = Static<typeof DeactivatedAt>
export const DeactivatedAt = Timestamp

export type EqualsCondition = Static<typeof EqualsCondition>
export const EqualsCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('equals'),
value: Type.Unknown()
})

export type NotEqualsCondition = Static<typeof NotEqualsCondition>
export const NotEqualsCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('not_equals'),
value: Type.Unknown()
})

export type ExistsCondition = Static<typeof ExistsCondition>
export const ExistsCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('exists')
})

export type NotExistsCondition = Static<typeof NotExistsCondition>
export const NotExistsCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('not_exists')
})

export type ContainsCondition = Static<typeof ContainsCondition>
export const ContainsCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('contains'),
value: Type.String()
})

export type StartsWithCondition = Static<typeof StartsWithCondition>
export const StartsWithCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('starts_with'),
value: Type.String()
})

export type EndsWithCondition = Static<typeof EndsWithCondition>
export const EndsWithCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('ends_with'),
value: Type.String()
})

export type RegexCondition = Static<typeof RegexCondition>
export const RegexCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('regex'),
pattern: RegexPattern
})

export type GreaterThanCondition = Static<typeof GreaterThanCondition>
export const GreaterThanCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('greater_than'),
value: Type.Number()
})

export type LessThanCondition = Static<typeof LessThanCondition>
export const LessThanCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('less_than'),
value: Type.Number()
})

export type GreaterThanOrEqualCondition = Static<typeof GreaterThanOrEqualCondition>
export const GreaterThanOrEqualCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('greater_than_or_equal'),
value: Type.Number()
})

export type LessThanOrEqualCondition = Static<typeof LessThanOrEqualCondition>
export const LessThanOrEqualCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('less_than_or_equal'),
value: Type.Number()
})

export type InCondition = Static<typeof InCondition>
export const InCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('in'),
values: Type.Array(Type.Unknown())
})

export type NotInCondition = Static<typeof NotInCondition>
export const NotInCondition = Type.Object({
field: FieldPath,
operator: Type.Literal('not_in'),
values: Type.Array(Type.Unknown())
})

export type FilterCondition = Static<typeof FilterCondition>
export const FilterCondition = Type.Union([
EqualsCondition,
NotEqualsCondition,
ExistsCondition,
NotExistsCondition,
ContainsCondition,
StartsWithCondition,
EndsWithCondition,
RegexCondition,
GreaterThanCondition,
LessThanCondition,
GreaterThanOrEqualCondition,
LessThanOrEqualCondition,
InCondition,
NotInCondition
])

export type FilterRules = Static<typeof FilterRules>
export const FilterRules = Type.Object({
logic: Type.Union([
Type.Literal('and'),
Type.Literal('or')
]),
conditions: Type.Array(FilterCondition)
})

export type TransformRules = Static<typeof TransformRules>
export const TransformRules = Type.Array(Type.String())

export type EnrichRules = Static<typeof EnrichRules>
export const EnrichRules = Type.Record(Type.String(), Type.Unknown())

export type FilterStep = Static<typeof FilterStep>
export const FilterStep = Type.Object({
type: Type.Literal('filter'),
rules: FilterRules
})

export type TransformStep = Static<typeof TransformStep>
export const TransformStep = Type.Object({
type: Type.Literal('transform'),
rules: TransformRules
})

export type EnrichStep = Static<typeof EnrichStep>
export const EnrichStep = Type.Object({
type: Type.Literal('enrich'),
rules: EnrichRules
})

export type PipelineStep = Static<typeof PipelineStep>
export const PipelineStep = Type.Union([
FilterStep,
TransformStep,
EnrichStep
])

export type Pipeline = Static<typeof Pipeline>
export const Pipeline = Type.Array(PipelineStep)

export type DraftMediation = Static<typeof DraftMediation>
export const DraftMediation = Type.Object({
status: Type.Literal('draft'),
id: MediationId,
topic: Topic,
destination: Destination,
pipeline: Pipeline,
createdAt: CreatedAt
})

export type ActiveMediation = Static<typeof ActiveMediation>
export const ActiveMediation = Type.Object({
status: Type.Literal('active'),
id: MediationId,
topic: Topic,
destination: Destination,
pipeline: Pipeline,
createdAt: CreatedAt,
activatedAt: ActivatedAt
})

export type DeactivatedMediation = Static<typeof DeactivatedMediation>
export const DeactivatedMediation = Type.Object({
status: Type.Literal('deactivated'),
id: MediationId,
topic: Topic,
destination: Destination,
pipeline: Pipeline,
createdAt: CreatedAt,
activatedAt: ActivatedAt,
deactivatedAt: DeactivatedAt
})

export type Mediation = Static<typeof Mediation>
export const Mediation = Type.Union([
DraftMediation,
ActiveMediation,
DeactivatedMediation
])
