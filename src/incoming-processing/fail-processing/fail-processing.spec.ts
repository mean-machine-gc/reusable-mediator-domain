import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { FailedProcessing } from '../types'
import { failProcessingSpec } from './core/fail-processing.spec'

type ShellInput = { cmd: { processingId: string; reason: string } }

export type FailProcessingShellFn = SpecFn<
    ShellInput,
    FailedProcessing,
    | 'not_found'
    | 'already_terminal',
    'processing-failed'
>

const steps: StepInfo[] = [
    { name: 'getIncomingProcessingById', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate failed timestamp from clock' },
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
