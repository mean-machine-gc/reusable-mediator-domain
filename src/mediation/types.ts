import type { CloudEvent } from 'cloudevents'

export type { Result } from '../shared/spec-framework'

// ── Domain Primitives ─────────────────────────────────────────────────────────

// Identifiers
export type MediationId = string
export type MediationIdFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_64'
  | 'not_a_uuid'
  | 'script_injection'

// Routing
export type Topic = string
export type TopicFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_short_min_2'
  | 'too_long_max_256'
  | 'invalid_format_dot_separated_segments'
  | 'invalid_chars_alphanumeric_hyphens_and_dots_only'
  | 'script_injection'

export type Destination = string
export type DestinationFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_2048'
  | 'invalid_format_url'
  | 'script_injection'

// Filter primitives
export type FieldPath = string
export type FieldPathFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_512'
  | 'invalid_format_dot_separated_segments'
  | 'invalid_chars_alphanumeric_hyphens_underscores_and_dots_only'
  | 'script_injection'

export type RegexPattern = string
export type RegexPatternFailure =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_1024'
  | 'invalid_regex'
  | 'script_injection'

// Temporal
export type CreatedAt = Date
export type CreatedAtFailure = 'not_a_date'

export type ActivatedAt = Date
export type ActivatedAtFailure = 'not_a_date'

export type DeactivatedAt = Date
export type DeactivatedAtFailure = 'not_a_date'

// ── Filter Conditions ─────────────────────────────────────────────────────────

// Equality
export type EqualsCondition = { field: FieldPath; operator: 'equals'; value: unknown }
export type NotEqualsCondition = { field: FieldPath; operator: 'not_equals'; value: unknown }

// Presence
export type ExistsCondition = { field: FieldPath; operator: 'exists' }
export type NotExistsCondition = { field: FieldPath; operator: 'not_exists' }

// String
export type ContainsCondition = { field: FieldPath; operator: 'contains'; value: string }
export type StartsWithCondition = { field: FieldPath; operator: 'starts_with'; value: string }
export type EndsWithCondition = { field: FieldPath; operator: 'ends_with'; value: string }
export type RegexCondition = { field: FieldPath; operator: 'regex'; pattern: RegexPattern }

// Comparison
export type GreaterThanCondition = { field: FieldPath; operator: 'greater_than'; value: number }
export type LessThanCondition = { field: FieldPath; operator: 'less_than'; value: number }
export type GreaterThanOrEqualCondition = { field: FieldPath; operator: 'greater_than_or_equal'; value: number }
export type LessThanOrEqualCondition = { field: FieldPath; operator: 'less_than_or_equal'; value: number }

// Collection
export type InCondition = { field: FieldPath; operator: 'in'; values: unknown[] }
export type NotInCondition = { field: FieldPath; operator: 'not_in'; values: unknown[] }

export type FilterCondition =
  | EqualsCondition
  | NotEqualsCondition
  | ExistsCondition
  | NotExistsCondition
  | ContainsCondition
  | StartsWithCondition
  | EndsWithCondition
  | RegexCondition
  | GreaterThanCondition
  | LessThanCondition
  | GreaterThanOrEqualCondition
  | LessThanOrEqualCondition
  | InCondition
  | NotInCondition

// ── Filter Rules ──────────────────────────────────────────────────────────────

export type FilterRules = {
  logic: 'and' | 'or'
  conditions: FilterCondition[]
}

export type FilterRulesFailure =
  | 'not_an_object'
  | 'missing_logic'
  | 'invalid_logic'
  | 'missing_conditions'
  | 'conditions_not_an_array'
  | 'conditions_empty'
  | 'invalid_condition'

// ── Transform & Enrich Rules ─────────────────────────────────────────────────

export type TransformRules = string[]
export type EnrichRules = Record<string, unknown>

// ── Transform Registry (runtime) ────────────────────────────────────────────

export type TransformFn = (event: CloudEvent) => CloudEvent
export type TransformRegistry = Record<string, TransformFn>

// ── Pipeline ──────────────────────────────────────────────────────────────────

export type FilterStep = { type: 'filter'; rules: FilterRules }
export type TransformStep = { type: 'transform'; rules: TransformRules }
export type EnrichStep = { type: 'enrich'; rules: EnrichRules }

export type PipelineStep = FilterStep | TransformStep | EnrichStep

export type Pipeline = PipelineStep[]

export type PipelineFailure =
  | 'not_an_array'
  | 'empty'
  | 'invalid_step'

// ── Mediation Aggregate ───────────────────────────────────────────────────────

export type DraftMediation = {
  status: 'draft'
  id: MediationId
  topic: Topic
  schema: unknown
  destination: Destination
  pipeline: Pipeline
  createdAt: CreatedAt
}

export type ActiveMediation = {
  status: 'active'
  id: MediationId
  topic: Topic
  schema: unknown
  destination: Destination
  pipeline: Pipeline
  createdAt: CreatedAt
  activatedAt: ActivatedAt
}

export type DeactivatedMediation = {
  status: 'deactivated'
  id: MediationId
  topic: Topic
  schema: unknown
  destination: Destination
  pipeline: Pipeline
  createdAt: CreatedAt
  activatedAt: ActivatedAt
  deactivatedAt: DeactivatedAt
}

export type Mediation = DraftMediation | ActiveMediation | DeactivatedMediation
