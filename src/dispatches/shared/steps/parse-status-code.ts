import type { ParseStatusCodeFn } from './parse-status-code.spec'

export const parseStatusCode: ParseStatusCodeFn['signature'] = (raw) => {
    if (typeof raw !== 'number' || isNaN(raw))
        return { ok: false, errors: ['not_a_number'] }

    const errors: ParseStatusCodeFn['failures'][] = []

    if (!Number.isInteger(raw)) errors.push('not_an_integer')
    if (raw < 100 || raw > 599) errors.push('out_of_range_min_100_max_599')

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['status-code-parsed'] }
}
