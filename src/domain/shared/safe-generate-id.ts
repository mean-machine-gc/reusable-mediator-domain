import type { SafeGenerateIdFn } from './safe-generate-id.spec'
import type { DomainDeps } from '../domain-deps'
import { ID } from './primitives'
import type { z } from 'zod'

const safeGenerateIdFactory =
    (schema: z.ZodType<string>) =>
    (rawDep: DomainDeps['generateId']): SafeGenerateIdFn['asyncSignature'] =>
    async () => {
        const raw = await rawDep()
        const parsed = schema.safeParse(raw.value)
        if (!parsed.success) {
            return { ok: false, errors: ['invalid_id'], details: parsed.error.issues.map(i => i.message) }
        }
        return { ok: true, value: parsed.data, successType: ['generated'] }
    }

export const _safeGenerateId = safeGenerateIdFactory(ID)
