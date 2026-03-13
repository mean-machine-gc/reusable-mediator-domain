import type { SafeGetMediationByIdFn } from './safe-get-mediation-by-id.spec'
import type { ParseMediationFn } from './parse-mediation.spec'
import type { DomainDeps } from '../domain-deps'
import { parseMediation } from './parse-mediation'

const safeGetMediationByIdFactory =
    (parse: ParseMediationFn['signature']) =>
    (rawGet: DomainDeps['getMediationById']): SafeGetMediationByIdFn['asyncSignature'] =>
    async (id) => {
        const raw = await rawGet(id)
        if (raw.successType.includes('not-found')) {
            return { ok: true, value: null, successType: ['not-found'] }
        }
        const parsed = parse(raw.value)
        if (!parsed.ok) {
            return { ok: false, errors: ['invalid_mediation'], details: parsed.details }
        }
        return { ok: true, value: parsed.value, successType: ['found'] }
    }

export const _safeGetMediationById = safeGetMediationByIdFactory(parseMediation)
