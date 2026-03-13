import type { ID, IDValidations } from './primitives'

// ── Shared Domain Primitives ─────────────────────────────────────────────────
// Primitives used across aggregate boundaries.

// Identifiers
export type ProcessingId = ID
export type ProcessingIdValidations = IDValidations

export type MediationId = ID
export type MediationIdValidations = IDValidations

// Routing
/**
 * @minLength 2
 * @maxLength 256
 */
export type Topic = string
export type TopicValidations =
  | 'not_a_string'
  | 'empty'
  | 'too_short_min_2'
  | 'too_long_max_256'
  | 'invalid_format_dot_separated_segments'
  | 'invalid_chars_alphanumeric_hyphens_and_dots_only'
  | 'script_injection'

/**
 * @minLength 1
 * @maxLength 2048
 */
export type Destination = string
export type DestinationValidations =
  | 'not_a_string'
  | 'empty'
  | 'too_long_max_2048'
  | 'invalid_format_url'
  | 'script_injection'
