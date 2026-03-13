import type { SpecFn, Spec } from '../shared/spec-framework'
import type { IncomingProcessing } from './types'
import { valid, invalid } from './fixtures'

export type ParseIncomingProcessingFailures = 'invalid_incoming_processing'

export type ParseIncomingProcessingFn = SpecFn<
    unknown,
    IncomingProcessing,
    ParseIncomingProcessingFailures,
    'incoming-processing-parsed'
>

export const parseIncomingProcessingSpec: Spec<ParseIncomingProcessingFn> = {
    shouldFailWith: {
        invalid_incoming_processing: {
            description: 'Input fails TypeBox validation against the IncomingProcessing schema',
            examples: [
                { description: 'null', whenInput: invalid.null },
                { description: 'string', whenInput: invalid.string },
                { description: 'empty object', whenInput: invalid.emptyObject },
                { description: 'missing status', whenInput: invalid.missingStatus },
                { description: 'unknown status', whenInput: invalid.unknownStatus },
                { description: 'invalid id type', whenInput: invalid.invalidId },
                { description: 'missing event', whenInput: invalid.missingEvent },
                { description: 'empty topic', whenInput: invalid.emptyTopic },
            ],
        },
    },
    shouldSucceedWith: {
        'incoming-processing-parsed': {
            description: 'Input is a valid IncomingProcessing aggregate (any variant)',
            examples: [
                { description: 'received', whenInput: valid.received, then: valid.received },
                { description: 'validated', whenInput: valid.validated, then: valid.validated },
                { description: 'mediated', whenInput: valid.mediated, then: valid.mediated },
                { description: 'failed', whenInput: valid.failed, then: valid.failed },
            ],
        },
    },
    shouldAssert: {
        'incoming-processing-parsed': {},
    },
}
