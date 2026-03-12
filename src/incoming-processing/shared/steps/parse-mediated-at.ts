import type { ParseMediatedAtFn } from './parse-mediated-at.spec'

export const parseMediatedAt: ParseMediatedAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['mediated-at-parsed'] }
}
