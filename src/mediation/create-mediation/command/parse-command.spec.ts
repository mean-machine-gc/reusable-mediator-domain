import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CreateMediationCommand } from './command'

export type ParseCreateMediationCommandFailures = 'invalid_create_mediation_command'

export type ParseCreateMediationCommandFn = SpecFn<
    unknown,
    CreateMediationCommand,
    ParseCreateMediationCommandFailures,
    'command-parsed'
>

const validCmd = {
    topic: 'patient.created',
    destination: 'https://example.com/webhook',
    pipeline: [
        {
            type: 'filter' as const,
            rules: {
                logic: 'and' as const,
                conditions: [{ field: 'data.type', operator: 'equals' as const, value: 'patient' }],
            },
        },
    ],
}

export const parseCreateMediationCommandSpec: Spec<ParseCreateMediationCommandFn> = {
    shouldFailWith: {
        invalid_create_mediation_command: {
            description: 'Input fails TypeBox validation against CreateMediationCommand',
            examples: [
                { description: 'null', whenInput: null },
                { description: 'string', whenInput: 'not-an-object' },
                { description: 'empty object', whenInput: {} },
                { description: 'missing topic', whenInput: { destination: 'https://example.com', pipeline: [] } },
                { description: 'missing destination', whenInput: { topic: 'patient.created', pipeline: [] } },
                { description: 'missing pipeline', whenInput: { topic: 'patient.created', destination: 'https://example.com' } },
                { description: 'invalid topic type', whenInput: { topic: 42, destination: 'https://example.com', pipeline: [] } },
                { description: 'pipeline not array', whenInput: { topic: 'patient.created', destination: 'https://example.com', pipeline: 'not-array' } },
                { description: 'invalid pipeline step', whenInput: { topic: 'patient.created', destination: 'https://example.com', pipeline: [{ type: 'unknown' }] } },
            ],
        },
    },
    shouldSucceedWith: {
        'command-parsed': {
            description: 'Input is a valid CreateMediationCommand',
            examples: [
                {
                    description: 'valid command with filter pipeline',
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
