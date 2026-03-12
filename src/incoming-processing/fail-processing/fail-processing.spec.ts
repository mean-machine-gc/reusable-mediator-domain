import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { FailedProcessing, ProcessingIdFailure, ProcessingFailureReasonFailure } from '../types'
import { parseProcessingIdSpec } from '../shared/steps/parse-processing-id.spec'
import { parseProcessingFailureReasonSpec } from '../shared/steps/parse-processing-failure-reason.spec'
import { failProcessingSpec } from './core/fail-processing.spec'

type ShellInput = { cmd: { processingId: unknown; reason: unknown } }

export type FailProcessingShellFn = SpecFn<
    ShellInput,
    FailedProcessing,
    | ProcessingIdFailure
    | ProcessingFailureReasonFailure
    | 'not_found'
    | 'already_terminal',
    'processing-failed'
>

const steps: StepInfo[] = [
    { name: 'parseProcessingId', type: 'step', description: 'Parse and validate the processing ID', spec: parseProcessingIdSpec as unknown as Spec<AnyFn> },
    { name: 'parseProcessingFailureReason', type: 'step', description: 'Parse and validate the failure reason', spec: parseProcessingFailureReasonSpec as unknown as Spec<AnyFn> },
    { name: 'loadState', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'generateFailedAt', type: 'dep', description: 'Generate failed timestamp from clock' },
    { name: 'failProcessingCore', type: 'step', description: 'Validate state gate and transition to failed', spec: failProcessingSpec as unknown as Spec<AnyFn> },
    { name: 'save', type: 'dep', description: 'Persist the updated aggregate' },
]

export const failProcessingShellSpec: Spec<FailProcessingShellFn> = {
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
