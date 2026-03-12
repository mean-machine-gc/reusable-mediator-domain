import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { MediatedProcessing, MediationOutcome, ProcessingIdFailure } from '../types'
import { parseProcessingIdSpec } from '../shared/steps/parse-processing-id.spec'
import { mediateProcessingSpec } from './core/mediate-processing.spec'

type ShellInput = { cmd: { processingId: unknown; outcomes: MediationOutcome[] } }

export type MediateProcessingShellFn = SpecFn<
    ShellInput,
    MediatedProcessing,
    | ProcessingIdFailure
    | 'not_found'
    | 'not_in_validated_state',
    'processing-mediated'
>

const steps: StepInfo[] = [
    { name: 'parseProcessingId', type: 'step', description: 'Parse and validate the processing ID', spec: parseProcessingIdSpec as unknown as Spec<AnyFn> },
    { name: 'loadState', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'generateMediatedAt', type: 'dep', description: 'Generate mediated timestamp from clock' },
    { name: 'mediateProcessingCore', type: 'step', description: 'Attach outcomes and transition to mediated', spec: mediateProcessingSpec as unknown as Spec<AnyFn> },
    { name: 'save', type: 'dep', description: 'Persist the updated aggregate' },
]

export const mediateProcessingShellSpec: Spec<MediateProcessingShellFn> = {
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
