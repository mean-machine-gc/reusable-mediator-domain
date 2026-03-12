// ── Shared Domain Primitives ─────────────────────────────────────────────────
// Primitives used across aggregate boundaries.

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
