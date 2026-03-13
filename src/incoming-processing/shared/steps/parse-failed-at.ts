import { Value } from '@sinclair/typebox/value'
import { FailedAt } from '../../schemas'
import type { ParseFailedAtFn } from './parse-failed-at.spec'

export const parseFailedAt: ParseFailedAtFn['signature'] = (raw) => {
    if (!Value.Check(FailedAt, raw)) {
        const details = [...Value.Errors(FailedAt, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_failed_at'], details }
    }

    return { ok: true, value: raw, successType: ['failed-at-parsed'] }
}
