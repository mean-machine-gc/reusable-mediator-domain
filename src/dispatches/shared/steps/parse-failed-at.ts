import type { ParseFailedAtFn } from './parse-failed-at.spec'

export const parseFailedAt: ParseFailedAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['failed-at-parsed'] }
}
