import { Value } from '@sinclair/typebox/value'
import { ProcessingFailureReason } from '../../schemas'
import type { ParseProcessingFailureReasonFn } from './parse-processing-failure-reason.spec'

export const parseProcessingFailureReason: ParseProcessingFailureReasonFn['signature'] = (raw) => {
    if (!Value.Check(ProcessingFailureReason, raw)) {
        const details = [...Value.Errors(ProcessingFailureReason, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_processing_failure_reason'], details }
    }

    return { ok: true, value: raw, successType: ['processing-failure-reason-parsed'] }
}
