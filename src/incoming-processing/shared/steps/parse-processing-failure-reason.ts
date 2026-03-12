import type { ParseProcessingFailureReasonFn } from './parse-processing-failure-reason.spec'

export const parseProcessingFailureReason: ParseProcessingFailureReasonFn['signature'] = (raw) => {
    if (typeof raw !== 'string')
        return { ok: false, errors: ['not_a_string'] }

    const errors: ParseProcessingFailureReasonFn['failures'][] = []

    if (raw.length === 0) errors.push('empty')
    if (raw.length > 4096) errors.push('too_long_max_4096')

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['processing-failure-reason-parsed'] }
}
