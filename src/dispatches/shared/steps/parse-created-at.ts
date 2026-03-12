import type { ParseCreatedAtFn } from './parse-created-at.spec'

export const parseCreatedAt: ParseCreatedAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['created-at-parsed'] }
}
