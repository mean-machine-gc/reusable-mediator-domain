import { z } from 'zod'

// ── Domain Primitives ────────────────────────────────────────────────────────

export const ID = z.string().min(1).max(64).regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
export type ID = z.infer<typeof ID>

export const Timestamp = z.date()
export type Timestamp = z.infer<typeof Timestamp>
