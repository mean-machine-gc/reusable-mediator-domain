import { IncomingProcessing } from './types'
import type { ParseIncomingProcessingFn } from './parse-incoming-processing.spec'

export const parseIncomingProcessing: ParseIncomingProcessingFn['signature'] = (raw) => {
    const result = IncomingProcessing.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_incoming_processing'], details }
    }
    return { ok: true, value: result.data, successType: ['incoming-processing-parsed'] }
}
