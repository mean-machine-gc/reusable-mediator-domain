import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ValidatedProcessing } from '../types'
import { validateProcessingSpec } from './core/validate-processing.spec'
import { safeGetIncomingProcessingByIdSpec } from '../safe-get-incoming-processing-by-id.spec'
import { safeGenerateTimestampSpec } from '../../shared/safe-generate-timestamp.spec'
import { safeResolveSchemaSpec } from '../../shared/safe-resolve-schema.spec'

type ShellInput = { cmd: { processingId: string } }

export type ValidateProcessingShellFn = SpecFn<
    ShellInput,
    ValidatedProcessing,
    | 'not_found'
    | 'not_in_received_state'
    | 'schema_not_found'
    | 'schema_validation_failed',
    'processing-validated'
>

const steps: StepInfo[] = [
    { name: 'safeGetIncomingProcessingById', type: 'safe-dep', description: 'Fetch and validate incoming processing from persistence', spec: asStepSpec(safeGetIncomingProcessingByIdSpec) },
    { name: 'safeResolveSchema', type: 'safe-dep', description: 'Resolve and validate JSON Schema from registry', spec: asStepSpec(safeResolveSchemaSpec) },
    { name: 'safeGenerateTimestamp', type: 'safe-dep', description: 'Generate and validate validated timestamp', spec: asStepSpec(safeGenerateTimestampSpec) },
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
