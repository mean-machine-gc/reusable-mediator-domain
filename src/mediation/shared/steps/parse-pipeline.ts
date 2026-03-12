import type { ParsePipelineFn } from './parse-pipeline.spec'

const VALID_STEP_TYPES = new Set(['filter', 'transform', 'enrich'])

const isValidStep = (step: unknown): boolean => {
    if (typeof step !== 'object' || step === null) return false
    const s = step as Record<string, unknown>
    return typeof s.type === 'string' && VALID_STEP_TYPES.has(s.type)
}

export const parsePipeline: ParsePipelineFn['signature'] = (raw) => {
    if (!Array.isArray(raw))
        return { ok: false, errors: ['not_an_array'] }

    const errors: ParsePipelineFn['failures'][] = []

    if (raw.length === 0) errors.push('empty')
    if (raw.length > 0 && raw.some((step) => !isValidStep(step)))
        errors.push('invalid_step')

    if (errors.length > 0) return { ok: false, errors }
    return { ok: true, value: raw, successType: ['pipeline-parsed'] }
}
