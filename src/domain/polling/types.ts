import type { ProcessingId, MediationId, Destination } from '../shared/types'
import type { DispatchId } from '../dispatches/types'

// ── Poll Received ─────────────────────────────────────────────────────────────

export type ValidationEntry = {
  processingId: ProcessingId
}

export type ValidationFailureEntry = {
  processingId: ProcessingId
  errors: string[]
}

export type PollReceivedResult = {
  validated: ValidationEntry[]
  failed: ValidationFailureEntry[]
}

// ── Poll Validated ────────────────────────────────────────────────────────────

export type MediatedEntry = {
  processingId: ProcessingId
  dispatches: { dispatchId: DispatchId; destination: Destination }[]
  skipped: MediationId[]
}

export type MediationFailureEntry = {
  processingId: ProcessingId
  errors: string[]
}

export type PollValidatedResult = {
  mediated: MediatedEntry[]
  failed: MediationFailureEntry[]
}

// ── Poll Dispatches ───────────────────────────────────────────────────────────

export type PollDispatchesResult = {
  delivered: DispatchId[]
  retrying: DispatchId[]
  exhausted: DispatchId[]
}
