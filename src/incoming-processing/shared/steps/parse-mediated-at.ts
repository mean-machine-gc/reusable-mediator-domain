import { Value } from '@sinclair/typebox/value'
import { MediatedAt } from '../../schemas'
import type { ParseMediatedAtFn } from './parse-mediated-at.spec'

export const parseMediatedAt: ParseMediatedAtFn['signature'] = (raw) => {
    if (!Value.Check(MediatedAt, raw)) {
        const details = [...Value.Errors(MediatedAt, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_mediated_at'], details }
    }

    return { ok: true, value: raw, successType: ['mediated-at-parsed'] }
}
