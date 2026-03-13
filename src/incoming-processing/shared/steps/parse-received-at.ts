import { Value } from '@sinclair/typebox/value'
import { ReceivedAt } from '../../schemas'
import type { ParseReceivedAtFn } from './parse-received-at.spec'

export const parseReceivedAt: ParseReceivedAtFn['signature'] = (raw) => {
    if (!Value.Check(ReceivedAt, raw)) {
        const details = [...Value.Errors(ReceivedAt, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_received_at'], details }
    }

    return { ok: true, value: raw, successType: ['received-at-parsed'] }
}
