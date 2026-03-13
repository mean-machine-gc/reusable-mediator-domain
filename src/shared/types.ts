import { z } from 'zod'
import { ID } from './primitives'

// ── Shared Domain Primitives ─────────────────────────────────────────────────
// Primitives used across aggregate boundaries.

// Identifiers
export const ProcessingId = ID
export type ProcessingId = z.infer<typeof ProcessingId>

export const MediationId = ID
export type MediationId = z.infer<typeof MediationId>

// Routing
export const Topic = z.string().min(2).max(256)
export type Topic = z.infer<typeof Topic>

export const Destination = z.string().min(1).max(2048)
export type Destination = z.infer<typeof Destination>
