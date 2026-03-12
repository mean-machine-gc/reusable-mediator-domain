import type { ParseDispatchIdFn } from './parse-dispatch-id.spec'

export const parseDispatchId: ParseDispatchIdFn['signature'] = (raw) => {
    if (typeof raw !== 'string')
        return { ok: false, errors: ['not_a_string'] }

    const errors: ParseDispatchIdFn['failures'][] = []

    if (raw.length === 0) errors.push('empty')
    if (raw.length > 64) errors.push('too_long_max_64')
    if (/<script|javascript:|on\w+\s*=/i.test(raw)) errors.push('script_injection')
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw))
        errors.push('not_a_uuid')

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['dispatch-id-parsed'] }
}
