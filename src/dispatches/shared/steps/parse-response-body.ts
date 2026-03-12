import type { ParseResponseBodyFn } from './parse-response-body.spec'

export const parseResponseBody: ParseResponseBodyFn['signature'] = (raw) => {
    if (typeof raw !== 'string')
        return { ok: false, errors: ['not_a_string'] }

    if (raw.length > 65536) return { ok: false, errors: ['too_long_max_65536'] }

    return { ok: true, value: raw, successType: ['response-body-parsed'] }
}
