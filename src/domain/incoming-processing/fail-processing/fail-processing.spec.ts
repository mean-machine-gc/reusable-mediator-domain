import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { FailedProcessing } from '../types'
import { failProcessingSpec } from './core/fail-processing.spec'
import { safeGetIncomingProcessingByIdSpec } from '../safe-get-incoming-processing-by-id.spec'
import { safeGenerateTimestampSpec } from '../../shared/safe-generate-timestamp.spec'

type ShellInput = { cmd: { processingId: string; reason: string } }

export type FailProcessingShellFn = SpecFn<
    ShellInput,
    FailedProcessing,
    | 'not_found'
    | 'already_terminal',
    'processing-failed'
>

const steps: StepInfo[] = [
    { name: 'safeGetIncomingProcessingById', type: 'safe-dep', description: 'Fetch and validate incoming processing from persistence', spec: asStepSpec(safeGetIncomingProcessingByIdSpec) },
    { name: 'safeGenerateTimestamp', type: 'safe-dep', description: 'Generate and validate failed timestamp', spec: asStepSpec(safeGenerateTimestampSpec) },
    { name: 'failProcessingCore', type: 'step', description: 'Validate state gate and transition to failed', spec: asStepSpec(failProcessingSpec) },
    { name: 'upsertIncomingProcessing', type: 'dep', description: 'Persist the updated aggregate' },
]

export const failProcessingShellSpec: Spec<FailProcessingShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        not_found: {
            description: 'No processing aggregate exists for this ID',
            examples: [],
        },
    },
    shouldSucceedWith: {
        'processing-failed': {
            description: 'Processing transitions to failed with a reason',
            examples: [],
        },
    },
    shouldAssert: {
        'processing-failed': {},
    },
}
