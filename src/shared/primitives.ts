// ── Domain Primitives ────────────────────────────────────────────────────────

/**
 * @minLength 1
 * @maxLength 64
 */
export type ID = string
export type IDValidations =
    | 'not_a_string'
    | 'empty'
    | 'too_long_max_64'
    | 'not_a_uuid'
    | 'script_injection'

export type Timestamp = Date
export type TimestampValidations = 'not_a_date'

// ── Generic Parse Functions ─────────────────────────────────────────────────

export const parseId = <S extends string>(raw: unknown, successType: S) => {
    if (typeof raw !== 'string')
        return { ok: false as const, errors: ['not_a_string'] as IDValidations[] }

    const errors: IDValidations[] = []

    if (raw.length === 0) errors.push('empty')
    if (raw.length > 64) errors.push('too_long_max_64')
    if (/<script|javascript:|on\w+\s*=/i.test(raw)) errors.push('script_injection')
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw))
        errors.push('not_a_uuid')

    if (errors.length > 0) return { ok: false as const, errors }
    return { ok: true as const, value: raw, successType: [successType] as [S] }
}

export const parseTimestamp = <S extends string>(raw: unknown, successType: S) => {
    if (!(raw instanceof Date) || isNaN(raw.getTime()))
        return { ok: false as const, errors: ['not_a_date'] as TimestampValidations[] }

    return { ok: true as const, value: raw, successType: [successType] as [S] }
}
