import { z } from 'zod'
import type { CloudEvent } from 'cloudevents'
import { MediationId, Topic, Destination } from '../shared/types'
import { Timestamp } from '../shared/primitives'

export type { Result } from '../shared/spec-framework'

// ── Re-exports for command schemas ──────────────────────────────────────────
export { MediationId, Topic, Destination }

// Filter primitives
export const FieldPath = z.string().min(1).max(512)
export type FieldPath = z.infer<typeof FieldPath>

export const RegexPattern = z.string().min(1).max(1024)
export type RegexPattern = z.infer<typeof RegexPattern>

// Temporal
export const CreatedAt = Timestamp
export type CreatedAt = z.infer<typeof CreatedAt>

export const ActivatedAt = Timestamp
export type ActivatedAt = z.infer<typeof ActivatedAt>

export const DeactivatedAt = Timestamp
export type DeactivatedAt = z.infer<typeof DeactivatedAt>

// ── Filter Conditions ─────────────────────────────────────────────────────────

export const EqualsCondition = z.object({ field: FieldPath, operator: z.literal('equals'), value: z.unknown() })
export type EqualsCondition = z.infer<typeof EqualsCondition>

export const NotEqualsCondition = z.object({ field: FieldPath, operator: z.literal('not_equals'), value: z.unknown() })
export type NotEqualsCondition = z.infer<typeof NotEqualsCondition>

export const ExistsCondition = z.object({ field: FieldPath, operator: z.literal('exists') })
export type ExistsCondition = z.infer<typeof ExistsCondition>

export const NotExistsCondition = z.object({ field: FieldPath, operator: z.literal('not_exists') })
export type NotExistsCondition = z.infer<typeof NotExistsCondition>

export const ContainsCondition = z.object({ field: FieldPath, operator: z.literal('contains'), value: z.string() })
export type ContainsCondition = z.infer<typeof ContainsCondition>

export const StartsWithCondition = z.object({ field: FieldPath, operator: z.literal('starts_with'), value: z.string() })
export type StartsWithCondition = z.infer<typeof StartsWithCondition>

export const EndsWithCondition = z.object({ field: FieldPath, operator: z.literal('ends_with'), value: z.string() })
export type EndsWithCondition = z.infer<typeof EndsWithCondition>

export const RegexCondition = z.object({ field: FieldPath, operator: z.literal('regex'), pattern: RegexPattern })
export type RegexCondition = z.infer<typeof RegexCondition>

export const GreaterThanCondition = z.object({ field: FieldPath, operator: z.literal('greater_than'), value: z.number() })
export type GreaterThanCondition = z.infer<typeof GreaterThanCondition>

export const LessThanCondition = z.object({ field: FieldPath, operator: z.literal('less_than'), value: z.number() })
export type LessThanCondition = z.infer<typeof LessThanCondition>

export const GreaterThanOrEqualCondition = z.object({ field: FieldPath, operator: z.literal('greater_than_or_equal'), value: z.number() })
export type GreaterThanOrEqualCondition = z.infer<typeof GreaterThanOrEqualCondition>

export const LessThanOrEqualCondition = z.object({ field: FieldPath, operator: z.literal('less_than_or_equal'), value: z.number() })
export type LessThanOrEqualCondition = z.infer<typeof LessThanOrEqualCondition>

export const InCondition = z.object({ field: FieldPath, operator: z.literal('in'), values: z.array(z.unknown()) })
export type InCondition = z.infer<typeof InCondition>

export const NotInCondition = z.object({ field: FieldPath, operator: z.literal('not_in'), values: z.array(z.unknown()) })
export type NotInCondition = z.infer<typeof NotInCondition>

export const FilterCondition = z.discriminatedUnion('operator', [
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
  NotInCondition,
])
export type FilterCondition = z.infer<typeof FilterCondition>

// ── Filter Rules ──────────────────────────────────────────────────────────────

export const FilterRules = z.object({
  logic: z.union([z.literal('and'), z.literal('or')]),
  conditions: z.array(FilterCondition),
})
export type FilterRules = z.infer<typeof FilterRules>

// ── Transform & Enrich Rules ─────────────────────────────────────────────────

export const TransformRules = z.array(z.string())
export type TransformRules = z.infer<typeof TransformRules>

export const EnrichRules = z.record(z.string(), z.unknown())
export type EnrichRules = z.infer<typeof EnrichRules>

// ── Transform Registry (runtime) ────────────────────────────────────────────

export type TransformFn = (event: CloudEvent) => CloudEvent
export type TransformRegistry = Record<string, TransformFn>

// ── Pipeline ──────────────────────────────────────────────────────────────────

export const FilterStep = z.object({ type: z.literal('filter'), rules: FilterRules })
export type FilterStep = z.infer<typeof FilterStep>

export const TransformStep = z.object({ type: z.literal('transform'), rules: TransformRules })
export type TransformStep = z.infer<typeof TransformStep>

export const EnrichStep = z.object({ type: z.literal('enrich'), rules: EnrichRules })
export type EnrichStep = z.infer<typeof EnrichStep>

export const PipelineStep = z.discriminatedUnion('type', [FilterStep, TransformStep, EnrichStep])
export type PipelineStep = z.infer<typeof PipelineStep>

export const Pipeline = z.array(PipelineStep).min(1)
export type Pipeline = z.infer<typeof Pipeline>

// ── Mediation Aggregate ───────────────────────────────────────────────────────

export const DraftMediation = z.object({
  status: z.literal('draft'),
  id: MediationId,
  topic: Topic,
  destination: Destination,
  pipeline: Pipeline,
  createdAt: CreatedAt,
})
export type DraftMediation = z.infer<typeof DraftMediation>

export const ActiveMediation = z.object({
  status: z.literal('active'),
  id: MediationId,
  topic: Topic,
  destination: Destination,
  pipeline: Pipeline,
  createdAt: CreatedAt,
  activatedAt: ActivatedAt,
})
export type ActiveMediation = z.infer<typeof ActiveMediation>

export const DeactivatedMediation = z.object({
  status: z.literal('deactivated'),
  id: MediationId,
  topic: Topic,
  destination: Destination,
  pipeline: Pipeline,
  createdAt: CreatedAt,
  activatedAt: ActivatedAt,
  deactivatedAt: DeactivatedAt,
})
export type DeactivatedMediation = z.infer<typeof DeactivatedMediation>

export const Mediation = z.discriminatedUnion('status', [
  DraftMediation,
  ActiveMediation,
  DeactivatedMediation,
])
export type Mediation = z.infer<typeof Mediation>
