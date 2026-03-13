import { Value } from '@sinclair/typebox/value'
import { ProcessingId } from '../../schemas'
import type { ParseProcessingIdFn } from './parse-processing-id.spec'

export const parseProcessingId: ParseProcessingIdFn['signature'] = (raw) => {
    if (typeof raw === 'string' && /<script|javascript:|on\w+\s*=/i.test(raw))
        return { ok: false, errors: ['script_injection'] }

    if (!Value.Check(ProcessingId, raw)) {
        const details = [...Value.Errors(ProcessingId, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_processing_id'], details }
    }

    return { ok: true, value: raw, successType: ['processing-id-parsed'] }
}
