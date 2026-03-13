import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ReceivedProcessing } from '../types'
import type { ParseProcessingIdFailures } from '../shared/steps/parse-processing-id.spec'
import { parseProcessingIdSpec } from '../shared/steps/parse-processing-id.spec'
import { receiveEventSpec } from './core/receive-event.spec'

type ShellInput = { cmd: { processingId: unknown; event: unknown } }

export type ReceiveEventShellFn = SpecFn<
    ShellInput,
    ReceivedProcessing,
    | ParseProcessingIdFailures
    | 'already_exists'
    | 'missing_event_type'
    | 'missing_dataschema',
    'event-received'
>

const steps: StepInfo[] = [
    { name: 'parseProcessingId', type: 'step', description: 'Parse and validate the processing ID', spec: asStepSpec(parseProcessingIdSpec) },
    { name: 'getIncomingProcessingById', type: 'dep', description: 'Load existing aggregate state from persistence (null if not found)' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate received timestamp from clock' },
    { name: 'receiveEventCore', type: 'step', description: 'Extract event info and assemble ReceivedProcessing', spec: asStepSpec(receiveEventSpec) },
    { name: 'upsertIncomingProcessing', type: 'dep', description: 'Persist the new aggregate' },
]

export const receiveEventShellSpec: Spec<ReceiveEventShellFn> = {
    document: true,
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
