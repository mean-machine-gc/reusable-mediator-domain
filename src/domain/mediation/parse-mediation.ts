import { Mediation } from './types'
import type { ParseMediationFn } from './parse-mediation.spec'

export const parseMediation: ParseMediationFn['signature'] = (raw) => {
    const result = Mediation.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_mediation'], details }
    }
    return { ok: true, value: result.data, successType: ['mediation-parsed'] }
}
