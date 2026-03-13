import type { SafeGetDispatchByIdFn } from './safe-get-dispatch-by-id.spec'
import type { ParseDispatchFn } from './parse-dispatch.spec'
import type { DomainDeps } from '../domain-deps'
import { parseDispatch } from './parse-dispatch'

const safeGetDispatchByIdFactory =
    (parse: ParseDispatchFn['signature']) =>
    (rawGet: DomainDeps['getDispatchById']): SafeGetDispatchByIdFn['asyncSignature'] =>
    async (id) => {
        const raw = await rawGet(id)
        if (raw.successType.includes('not-found')) {
            return { ok: true, value: null, successType: ['not-found'] }
        }
        const parsed = parse(raw.value)
        if (!parsed.ok) {
            return { ok: false, errors: ['invalid_dispatch'], details: parsed.details }
        }
        return { ok: true, value: parsed.value, successType: ['found'] }
    }

export const _safeGetDispatchById = safeGetDispatchByIdFactory(parseDispatch)
