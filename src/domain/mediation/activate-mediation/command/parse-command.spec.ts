import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ActivateMediationCommand } from './command'

export type ParseActivateMediationCommandFailures = 'invalid_activate_mediation_command'

export type ParseActivateMediationCommandFn = SpecFn<
    unknown,
    ActivateMediationCommand,
    ParseActivateMediationCommandFailures,
    'command-parsed'
>

const validCmd = { mediationId: '550e8400-e29b-41d4-a716-446655440000' }

export const parseActivateMediationCommandSpec: Spec<ParseActivateMediationCommandFn> = {
    shouldFailWith: {
        invalid_activate_mediation_command: {
            description: 'Input fails TypeBox validation against ActivateMediationCommand',
            examples: [
                { description: 'null', whenInput: null },
                { description: 'string', whenInput: 'not-an-object' },
                { description: 'empty object', whenInput: {} },
                { description: 'missing mediationId', whenInput: {} },
                { description: 'invalid mediationId type', whenInput: { mediationId: 42 } },
                { description: 'mediationId not a UUID', whenInput: { mediationId: 'not-a-uuid' } },
            ],
        },
    },
    shouldSucceedWith: {
        'command-parsed': {
            description: 'Input is a valid ActivateMediationCommand',
            examples: [
                {
                    description: 'valid command',
                    whenInput: validCmd,
                    then: validCmd,
                },
            ],
        },
    },
    shouldAssert: {
        'command-parsed': {},
    },
}
