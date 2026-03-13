import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ToDeliverDispatch, DispatchIdValidations } from '../types'
import type { ProcessingIdValidations, MediationIdValidations, DestinationValidations } from '../../shared/types'
import { parseDispatchIdSpec } from '../shared/steps/parse-dispatch-id.spec'
import { createDispatchSpec } from './core/create-dispatch.spec'

type ShellInput = {
    cmd: {
        dispatchId: unknown
        processingId: unknown
        mediationId: unknown
        destination: unknown
        event: unknown
    }
}

export type CreateDispatchShellFn = SpecFn<
    ShellInput,
    ToDeliverDispatch,
    | DispatchIdValidations
    | ProcessingIdValidations
    | MediationIdValidations
    | DestinationValidations
    | 'already_exists',
    'dispatch-created'
>

const steps: StepInfo[] = [
    { name: 'parseDispatchId', type: 'step', description: 'Parse and validate the dispatch ID', spec: asStepSpec(parseDispatchIdSpec) },
    { name: 'getDispatchById', type: 'dep', description: 'Load existing aggregate state from persistence (null if not found)' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate created timestamp from clock' },
    { name: 'createDispatchCore', type: 'step', description: 'Validate state gate and assemble ToDeliverDispatch', spec: asStepSpec(createDispatchSpec) },
    { name: 'upsertDispatch', type: 'dep', description: 'Persist the new aggregate' },
]

export const createDispatchShellSpec: Spec<CreateDispatchShellFn> = {
    document: true,
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'dispatch-created': {
            description: 'A new dispatch is created in to-deliver state',
            examples: [],
        },
    },
    shouldAssert: {
        'dispatch-created': {},
    },
}
