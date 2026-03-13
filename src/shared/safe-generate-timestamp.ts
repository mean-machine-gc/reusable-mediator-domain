import type { SafeGenerateTimestampFn } from './safe-generate-timestamp.spec'
import type { DomainDeps } from '../domain-deps'
import { Timestamp } from './primitives'
import type { z } from 'zod'

const safeGenerateTimestampFactory =
    (schema: z.ZodType<Date>) =>
    (rawDep: DomainDeps['generateTimestamp']): SafeGenerateTimestampFn['asyncSignature'] =>
    async () => {
        const raw = await rawDep()
        const parsed = schema.safeParse(raw.value)
        if (!parsed.success) {
            return { ok: false, errors: ['invalid_timestamp'], details: parsed.error.issues.map(i => i.message) }
        }
        return { ok: true, value: parsed.data, successType: ['generated'] }
    }

export const _safeGenerateTimestamp = safeGenerateTimestampFactory(Timestamp)
