import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ReceivedProcessing } from '../types'
import type { ReceiveEventCommand } from './command/command'
import { receiveEventSpec } from './core/receive-event.spec'
import { safeGetIncomingProcessingByIdSpec } from '../safe-get-incoming-processing-by-id.spec'
import { safeGenerateTimestampSpec } from '../../shared/safe-generate-timestamp.spec'

type ShellInput = { cmd: ReceiveEventCommand }

export type ReceiveEventShellFn = SpecFn<
    ShellInput,
    ReceivedProcessing,
    | 'already_exists'
    | 'missing_event_type'
    | 'missing_dataschema',
    'event-received'
>

const steps: StepInfo[] = [
    { name: 'safeGetIncomingProcessingById', type: 'safe-dep', description: 'Fetch and validate incoming processing from persistence', spec: asStepSpec(safeGetIncomingProcessingByIdSpec) },
    { name: 'safeGenerateTimestamp', type: 'safe-dep', description: 'Generate and validate received timestamp', spec: asStepSpec(safeGenerateTimestampSpec) },
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
