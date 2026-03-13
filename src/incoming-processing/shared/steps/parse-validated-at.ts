import { Value } from '@sinclair/typebox/value'
import { ValidatedAt } from '../../schemas'
import type { ParseValidatedAtFn } from './parse-validated-at.spec'

export const parseValidatedAt: ParseValidatedAtFn['signature'] = (raw) => {
    if (!Value.Check(ValidatedAt, raw)) {
        const details = [...Value.Errors(ValidatedAt, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_validated_at'], details }
    }

    return { ok: true, value: raw, successType: ['validated-at-parsed'] }
}
