import type { SafeDeliverFn } from './safe-deliver.spec'
import type { DomainDeps } from '../domain-deps'
import { DeliveryAttempt } from './types'
import type { z } from 'zod'

const safeDeliverFactory =
    (schema: z.ZodType<z.infer<typeof DeliveryAttempt>>) =>
    (rawDep: DomainDeps['deliver']): SafeDeliverFn['asyncSignature'] =>
    async (dispatch) => {
        const raw = await rawDep(dispatch)
        const parsed = schema.safeParse(raw.value)
        if (!parsed.success) {
            return { ok: false, errors: ['invalid_delivery_attempt'], details: parsed.error.issues.map(i => i.message) }
        }
        return { ok: true, value: parsed.data, successType: raw.successType }
    }

export const _safeDeliver = safeDeliverFactory(DeliveryAttempt)
