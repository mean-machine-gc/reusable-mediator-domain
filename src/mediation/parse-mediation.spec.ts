import type { SpecFn, Spec } from '../shared/spec-framework'
import type { Mediation } from './types'
import { valid, invalid } from './fixtures'

export type ParseMediationFailures = 'invalid_mediation'

export type ParseMediationFn = SpecFn<
    unknown,
    Mediation,
    ParseMediationFailures,
    'mediation-parsed'
>

export const parseMediationSpec: Spec<ParseMediationFn> = {
    shouldFailWith: {
        invalid_mediation: {
            description: 'Input fails TypeBox validation against the Mediation schema',
            examples: [
                { description: 'null', whenInput: invalid.null },
                { description: 'string', whenInput: invalid.string },
                { description: 'empty object', whenInput: invalid.emptyObject },
                { description: 'missing status', whenInput: invalid.missingStatus },
                { description: 'unknown status', whenInput: invalid.unknownStatus },
                { description: 'invalid id type', whenInput: invalid.invalidId },
                { description: 'empty topic', whenInput: invalid.emptyTopic },
                { description: 'empty pipeline', whenInput: invalid.emptyPipeline },
            ],
        },
    },
    shouldSucceedWith: {
        'mediation-parsed': {
            description: 'Input is a valid Mediation aggregate (any variant)',
            examples: [
                { description: 'draft', whenInput: valid.draft, then: valid.draft },
                { description: 'active', whenInput: valid.active, then: valid.active },
                { description: 'deactivated', whenInput: valid.deactivated, then: valid.deactivated },
            ],
        },
    },
    shouldAssert: {
        'mediation-parsed': {},
    },
}
