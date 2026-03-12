import type { ParseDestinationFn } from './parse-destination.spec'

export const parseDestination: ParseDestinationFn['signature'] = (raw) => {
    if (typeof raw !== 'string')
        return { ok: false, errors: ['not_a_string'] }

    const errors: ParseDestinationFn['failures'][] = []

    if (raw.length === 0) errors.push('empty')
    if (raw.length > 2048) errors.push('too_long_max_2048')
    if (/<script|javascript:|on\w+\s*=/i.test(raw)) errors.push('script_injection')

    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
        errors.push('invalid_format_url')
    } else {
        try {
            new URL(raw)
        } catch {
            errors.push('invalid_format_url')
        }
    }

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['destination-parsed'] }
}
