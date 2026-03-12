import type { ParseAttemptedAtFn } from './parse-attempted-at.spec'

export const parseAttemptedAt: ParseAttemptedAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['attempted-at-parsed'] }
}
