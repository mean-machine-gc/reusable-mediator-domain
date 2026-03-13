import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { DeactivateMediationCommand } from './command'

export type ParseDeactivateMediationCommandFailures = 'invalid_deactivate_mediation_command'

export type ParseDeactivateMediationCommandFn = SpecFn<
    unknown,
    DeactivateMediationCommand,
    ParseDeactivateMediationCommandFailures,
    'command-parsed'
>

const validCmd = { mediationId: '550e8400-e29b-41d4-a716-446655440000' }

export const parseDeactivateMediationCommandSpec: Spec<ParseDeactivateMediationCommandFn> = {
    shouldFailWith: {
        invalid_deactivate_mediation_command: {
            description: 'Input fails TypeBox validation against DeactivateMediationCommand',
            examples: [
                { description: 'null', whenInput: null },
                { description: 'string', whenInput: 'not-an-object' },
                { description: 'empty object', whenInput: {} },
                { description: 'invalid mediationId type', whenInput: { mediationId: 42 } },
                { description: 'mediationId not a UUID', whenInput: { mediationId: 'not-a-uuid' } },
            ],
        },
    },
    shouldSucceedWith: {
        'command-parsed': {
            description: 'Input is a valid DeactivateMediationCommand',
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
