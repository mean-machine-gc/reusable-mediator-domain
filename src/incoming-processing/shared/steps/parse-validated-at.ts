import type { ParseValidatedAtFn } from './parse-validated-at.spec'

export const parseValidatedAt: ParseValidatedAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['validated-at-parsed'] }
}
