import { Value } from '@sinclair/typebox/value'
import { DataschemaUri } from '../../schemas'
import type { ParseDataschemaUriFn } from './parse-dataschema-uri.spec'

export const parseDataschemaUri: ParseDataschemaUriFn['signature'] = (raw) => {
    if (typeof raw === 'string' && /<script|javascript:|on\w+\s*=/i.test(raw))
        return { ok: false, errors: ['script_injection'] }

    if (!Value.Check(DataschemaUri, raw)) {
        const details = [...Value.Errors(DataschemaUri, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_dataschema_uri'], details }
    }

    if (!raw.startsWith('http://') && !raw.startsWith('https://'))
        return { ok: false, errors: ['invalid_format_url'] }

    try {
        new URL(raw)
    } catch {
        return { ok: false, errors: ['invalid_format_url'] }
    }

    return { ok: true, value: raw, successType: ['dataschema-uri-parsed'] }
}
