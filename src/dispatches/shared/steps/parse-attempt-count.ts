import type { ParseAttemptCountFn } from './parse-attempt-count.spec'

export const parseAttemptCount: ParseAttemptCountFn['signature'] = (raw) => {
    if (typeof raw !== 'number' || isNaN(raw))
        return { ok: false, errors: ['not_a_number'] }

    const errors: ParseAttemptCountFn['failures'][] = []

    if (!Number.isInteger(raw)) errors.push('not_an_integer')
    if (raw < 0) errors.push('negative')

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['attempt-count-parsed'] }
}
