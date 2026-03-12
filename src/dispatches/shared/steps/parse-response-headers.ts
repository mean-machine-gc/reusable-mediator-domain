import type { ParseResponseHeadersFn } from './parse-response-headers.spec'

export const parseResponseHeaders: ParseResponseHeadersFn['signature'] = (raw) => {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw))
        return { ok: false, errors: ['not_an_object'] }

    return { ok: true, value: raw as Record<string, string>, successType: ['response-headers-parsed'] }
}
