import { Dispatch } from './types'
import type { ParseDispatchFn } from './parse-dispatch.spec'

export const parseDispatch: ParseDispatchFn['signature'] = (raw) => {
    const result = Dispatch.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_dispatch'], details }
    }
    return { ok: true, value: result.data, successType: ['dispatch-parsed'] }
}
