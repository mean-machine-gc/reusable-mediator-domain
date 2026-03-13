import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ValidatedProcessing } from '../types'
import type { ParseProcessingIdFailures } from '../shared/steps/parse-processing-id.spec'
import { parseProcessingIdSpec } from '../shared/steps/parse-processing-id.spec'
import { validateProcessingSpec } from './core/validate-processing.spec'

type ShellInput = { cmd: { processingId: unknown } }

export type ValidateProcessingShellFn = SpecFn<
    ShellInput,
    ValidatedProcessing,
    | ParseProcessingIdFailures
    | 'not_found'
    | 'not_in_received_state'
    | 'schema_not_found'
    | 'schema_validation_failed',
    'processing-validated'
>

const steps: StepInfo[] = [
    { name: 'parseProcessingId', type: 'step', description: 'Parse and validate the processing ID', spec: asStepSpec(parseProcessingIdSpec) },
    { name: 'getIncomingProcessingById', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'resolveSchema', type: 'dep', description: 'Resolve JSON Schema from registry using dataschemaUri' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate validated timestamp from clock' },
    { name: 'validateProcessingCore', type: 'step', description: 'Validate event data against schema and transition to validated', spec: asStepSpec(validateProcessingSpec) },
    { name: 'upsertIncomingProcessing', type: 'dep', description: 'Persist the updated aggregate' },
]

export const validateProcessingShellSpec: Spec<ValidateProcessingShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        not_found: {
            description: 'No processing aggregate exists for this ID',
            examples: [],
        },
        schema_not_found: {
            description: 'The dataschema URI does not resolve to a known schema',
            examples: [],
        },
    },
    shouldSucceedWith: {
        'processing-validated': {
            description: 'Event data validated against schema, processing transitions to validated',
            examples: [],
        },
    },
    shouldAssert: {
        'processing-validated': {},
    },
}
