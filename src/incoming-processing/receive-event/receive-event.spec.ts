import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { ReceivedProcessing, ProcessingIdFailure } from '../types'
import { parseProcessingIdSpec } from '../shared/steps/parse-processing-id.spec'
import { receiveEventSpec } from './core/receive-event.spec'

type ShellInput = { cmd: { processingId: unknown; event: unknown } }

export type ReceiveEventShellFn = SpecFn<
    ShellInput,
    ReceivedProcessing,
    | ProcessingIdFailure
    | 'already_exists'
    | 'missing_event_type'
    | 'missing_dataschema',
    'event-received'
>

const steps: StepInfo[] = [
    { name: 'parseProcessingId', type: 'step', description: 'Parse and validate the processing ID', spec: parseProcessingIdSpec as unknown as Spec<AnyFn> },
    { name: 'loadState', type: 'dep', description: 'Load existing aggregate state from persistence (null if not found)' },
    { name: 'generateReceivedAt', type: 'dep', description: 'Generate received timestamp from clock' },
    { name: 'receiveEventCore', type: 'step', description: 'Extract event info and assemble ReceivedProcessing', spec: receiveEventSpec as unknown as Spec<AnyFn> },
    { name: 'save', type: 'dep', description: 'Persist the new aggregate' },
]

export const receiveEventShellSpec: Spec<ReceiveEventShellFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'event-received': {
            description: 'A new ReceivedProcessing aggregate is created from the incoming event',
            examples: [],
        },
    },
    shouldAssert: {
        'event-received': {},
    },
}
