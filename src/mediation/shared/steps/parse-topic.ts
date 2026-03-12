import type { ParseTopicFn } from './parse-topic.spec'

export const parseTopic: ParseTopicFn['signature'] = (raw) => {
    if (typeof raw !== 'string')
        return { ok: false, errors: ['not_a_string'] }

    const errors: ParseTopicFn['failures'][] = []

    if (raw.length === 0) errors.push('empty')
    if (raw.length > 0 && raw.length < 2) errors.push('too_short_min_2')
    if (raw.length > 256) errors.push('too_long_max_256')
    if (/<script|javascript:|on\w+\s*=/i.test(raw)) errors.push('script_injection')
    if (!/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(raw))
        errors.push('invalid_format_dot_separated_segments')
    if (/[^a-zA-Z0-9.\-]/.test(raw))
        errors.push('invalid_chars_alphanumeric_hyphens_and_dots_only')

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['topic-parsed'] }
}
