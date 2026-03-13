import type { SafeGetIncomingProcessingByIdFn } from './safe-get-incoming-processing-by-id.spec'
import type { ParseIncomingProcessingFn } from './parse-incoming-processing.spec'
import type { DomainDeps } from '../domain-deps'
import { parseIncomingProcessing } from './parse-incoming-processing'

const safeGetIncomingProcessingByIdFactory =
    (parse: ParseIncomingProcessingFn['signature']) =>
    (rawGet: DomainDeps['getIncomingProcessingById']): SafeGetIncomingProcessingByIdFn['asyncSignature'] =>
    async (id) => {
        const raw = await rawGet(id)
        if (raw.successType.includes('not-found')) {
            return { ok: true, value: null, successType: ['not-found'] }
        }
        const parsed = parse(raw.value)
        if (!parsed.ok) {
            return { ok: false, errors: ['invalid_incoming_processing'], details: parsed.details }
        }
        return { ok: true, value: parsed.value, successType: ['found'] }
    }

export const _safeGetIncomingProcessingById = safeGetIncomingProcessingByIdFactory(parseIncomingProcessing)
