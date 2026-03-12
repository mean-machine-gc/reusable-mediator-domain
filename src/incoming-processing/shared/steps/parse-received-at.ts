import type { ParseReceivedAtFn } from './parse-received-at.spec'

export const parseReceivedAt: ParseReceivedAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['received-at-parsed'] }
}
