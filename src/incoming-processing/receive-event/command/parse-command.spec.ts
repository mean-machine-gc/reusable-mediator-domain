import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ReceiveEventCommand } from './command'

export type ParseReceiveEventCommandFailures = 'invalid_receive_event_command'

export type ParseReceiveEventCommandFn = SpecFn<
    unknown,
    ReceiveEventCommand,
    ParseReceiveEventCommandFailures,
    'command-parsed'
>

const validCmd = {
    processingId: '550e8400-e29b-41d4-a716-446655440000',
    event: { type: 'patient.created', source: '/test', id: '1', data: {} },
}

export const parseReceiveEventCommandSpec: Spec<ParseReceiveEventCommandFn> = {
    shouldFailWith: {
        invalid_receive_event_command: {
            description: 'Input fails TypeBox validation against ReceiveEventCommand',
            examples: [
                { description: 'null', whenInput: null },
                { description: 'string', whenInput: 'not-an-object' },
                { description: 'empty object', whenInput: {} },
                { description: 'missing processingId', whenInput: { event: { type: 'test', source: '/test' } } },
                { description: 'missing event', whenInput: { processingId: '550e8400-e29b-41d4-a716-446655440000' } },
                { description: 'invalid processingId type', whenInput: { processingId: 42, event: {} } },
                { description: 'processingId not a UUID', whenInput: { processingId: 'not-a-uuid', event: {} } },
                { description: 'event not an object', whenInput: { processingId: '550e8400-e29b-41d4-a716-446655440000', event: 'not-an-object' } },
            ],
        },
    },
    shouldSucceedWith: {
        'command-parsed': {
            description: 'Input is a valid ReceiveEventCommand',
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
