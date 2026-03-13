import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { MediatedProcessing, MediationOutcome } from '../types'
import type { ParseProcessingIdFailures } from '../shared/steps/parse-processing-id.spec'
import { parseProcessingIdSpec } from '../shared/steps/parse-processing-id.spec'
import { mediateProcessingSpec } from './core/mediate-processing.spec'

type ShellInput = { cmd: { processingId: unknown; outcomes: MediationOutcome[] } }

export type MediateProcessingShellFn = SpecFn<
    ShellInput,
    MediatedProcessing,
    | ParseProcessingIdFailures
    | 'not_found'
    | 'not_in_validated_state',
    'processing-mediated'
>

const steps: StepInfo[] = [
    { name: 'parseProcessingId', type: 'step', description: 'Parse and validate the processing ID', spec: asStepSpec(parseProcessingIdSpec) },
    { name: 'getIncomingProcessingById', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate mediated timestamp from clock' },
    { name: 'mediateProcessingCore', type: 'step', description: 'Attach outcomes and transition to mediated', spec: asStepSpec(mediateProcessingSpec) },
    { name: 'upsertIncomingProcessing', type: 'dep', description: 'Persist the updated aggregate' },
]

export const mediateProcessingShellSpec: Spec<MediateProcessingShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        not_found: {
            description: 'No processing aggregate exists for this ID',
            examples: [],
        },
    },
    shouldSucceedWith: {
        'processing-mediated': {
            description: 'Processing transitions to mediated with pre-computed outcomes attached',
            examples: [],
        },
    },
    shouldAssert: {
        'processing-mediated': {},
    },
}
