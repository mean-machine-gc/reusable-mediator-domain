import type { ExtractEventTypeFn } from './extract-event-type.spec'

export const extractEventType: ExtractEventTypeFn['signature'] = (event) => {
    const dataschema = (event as any).dataschema
    if (!dataschema) {
        return { ok: false, errors: ['missing_dataschema'] }
    }

    return {
        ok: true,
        value: {
            topic: (event as any).type,
            dataschemaUri: dataschema,
        },
        successType: ['event-type-extracted'],
    }
}
