import type { ParseDeliveredAtFn } from './parse-delivered-at.spec'

export const parseDeliveredAt: ParseDeliveredAtFn['signature'] = (raw) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false, errors: ['not_a_date'] }

    return { ok: true, value: raw, successType: ['delivered-at-parsed'] }
}
