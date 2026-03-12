import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { ToDeliverDispatch, DispatchIdFailure } from '../types'
import type { ProcessingIdFailure, MediationIdFailure, DestinationFailure } from '../../shared/types'
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
    | DispatchIdFailure
    | ProcessingIdFailure
    | MediationIdFailure
    | DestinationFailure
    | 'already_exists',
    'dispatch-created'
>

const steps: StepInfo[] = [
    { name: 'parseDispatchId', type: 'step', description: 'Parse and validate the dispatch ID', spec: parseDispatchIdSpec as unknown as Spec<AnyFn> },
    { name: 'loadState', type: 'dep', description: 'Load existing aggregate state from persistence (null if not found)' },
    { name: 'generateCreatedAt', type: 'dep', description: 'Generate created timestamp from clock' },
    { name: 'createDispatchCore', type: 'step', description: 'Validate state gate and assemble ToDeliverDispatch', spec: createDispatchSpec as unknown as Spec<AnyFn> },
    { name: 'save', type: 'dep', description: 'Persist the new aggregate' },
]

export const createDispatchShellSpec: Spec<CreateDispatchShellFn> = {
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
