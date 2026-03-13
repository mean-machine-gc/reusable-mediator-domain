import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { MediatedProcessing, MediationOutcome } from '../types'
import { mediateProcessingSpec } from './core/mediate-processing.spec'
import { safeGetIncomingProcessingByIdSpec } from '../safe-get-incoming-processing-by-id.spec'
import { safeGenerateTimestampSpec } from '../../shared/safe-generate-timestamp.spec'

type ShellInput = { cmd: { processingId: string; outcomes: MediationOutcome[] } }

export type MediateProcessingShellFn = SpecFn<
    ShellInput,
    MediatedProcessing,
    | 'not_found'
    | 'not_in_validated_state',
    'processing-mediated'
>

const steps: StepInfo[] = [
    { name: 'safeGetIncomingProcessingById', type: 'safe-dep', description: 'Fetch and validate incoming processing from persistence', spec: asStepSpec(safeGetIncomingProcessingByIdSpec) },
    { name: 'safeGenerateTimestamp', type: 'safe-dep', description: 'Generate and validate mediated timestamp', spec: asStepSpec(safeGenerateTimestampSpec) },
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
