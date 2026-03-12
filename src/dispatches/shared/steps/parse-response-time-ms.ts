import type { ParseResponseTimeMsFn } from './parse-response-time-ms.spec'

export const parseResponseTimeMs: ParseResponseTimeMsFn['signature'] = (raw) => {
    if (typeof raw !== 'number' || isNaN(raw))
        return { ok: false, errors: ['not_a_number'] }

    if (raw < 0) return { ok: false, errors: ['negative'] }

    return { ok: true, value: raw, successType: ['response-time-ms-parsed'] }
}
