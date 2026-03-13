import type { SpecFn, Spec } from '../shared/spec-framework'
import type { Dispatch } from './types'
import { valid, invalid } from './fixtures'

export type ParseDispatchFailures = 'invalid_dispatch'

export type ParseDispatchFn = SpecFn<
    unknown,
    Dispatch,
    ParseDispatchFailures,
    'dispatch-parsed'
>

export const parseDispatchSpec: Spec<ParseDispatchFn> = {
    shouldFailWith: {
        invalid_dispatch: {
            description: 'Input fails TypeBox validation against the Dispatch schema',
            examples: [
                { description: 'null', whenInput: invalid.null },
                { description: 'string', whenInput: invalid.string },
                { description: 'empty object', whenInput: invalid.emptyObject },
                { description: 'missing status', whenInput: invalid.missingStatus },
                { description: 'unknown status', whenInput: invalid.unknownStatus },
                { description: 'invalid id type', whenInput: invalid.invalidId },
                { description: 'missing event', whenInput: invalid.missingEvent },
                { description: 'invalid attempt count', whenInput: invalid.invalidAttemptCount },
            ],
        },
    },
    shouldSucceedWith: {
        'dispatch-parsed': {
            description: 'Input is a valid Dispatch aggregate (any variant)',
            examples: [
                { description: 'to-deliver', whenInput: valid.toDeliver, then: valid.toDeliver },
                { description: 'attempted', whenInput: valid.attempted, then: valid.attempted },
                { description: 'delivered', whenInput: valid.delivered, then: valid.delivered },
                { description: 'failed', whenInput: valid.failed, then: valid.failed },
            ],
        },
    },
    shouldAssert: {
        'dispatch-parsed': {},
    },
}
