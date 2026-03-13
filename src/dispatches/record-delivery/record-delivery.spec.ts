import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type {
    DispatchIdValidations,
    DeliveredDispatch,
    AttemptedDispatch,
    FailedDispatch,
} from '../types'
import { parseDispatchIdSpec } from '../shared/steps/parse-dispatch-id.spec'
import { recordDeliverySpec } from './core/record-delivery.spec'

type ShellInput = {
    cmd: {
        dispatchId: unknown
    }
}

export type RecordDeliveryOutput = DeliveredDispatch | AttemptedDispatch | FailedDispatch

export type RecordDeliveryShellFn = SpecFn<
    ShellInput,
    RecordDeliveryOutput,
    | DispatchIdValidations
    | 'not_found'
    | 'already_terminal',
    'delivered' | 'attempt-recorded' | 'max-attempts-exhausted'
>

const steps: StepInfo[] = [
    { name: 'parseDispatchId', type: 'step', description: 'Parse and validate the dispatch ID', spec: asStepSpec(parseDispatchIdSpec) },
    { name: 'getDispatchById', type: 'dep', description: 'Load aggregate state from persistence' },
    { name: 'deliver', type: 'dep', description: 'Attempt HTTP delivery to destination, returns DeliveryAttempt' },
    { name: 'getMaxAttempts', type: 'dep', description: 'Retrieve the max attempts configuration' },
    { name: 'recordDeliveryCore', type: 'step', description: 'Evaluate attempt result, transition state accordingly', spec: asStepSpec(recordDeliverySpec) },
    { name: 'upsertDispatch', type: 'dep', description: 'Persist the updated aggregate' },
]

export const recordDeliveryShellSpec: Spec<RecordDeliveryShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        not_found: {
            description: 'No dispatch aggregate exists for this ID',
            examples: [],
        },
    },
    shouldSucceedWith: {
        'delivered': {
            description: 'Delivery succeeded, dispatch marked as delivered',
            examples: [],
        },
        'attempt-recorded': {
            description: 'Delivery failed but retries remain, attempt recorded',
            examples: [],
        },
        'max-attempts-exhausted': {
            description: 'Delivery failed and max retries reached, dispatch marked as failed',
            examples: [],
        },
    },
    shouldAssert: {
        'delivered': {},
        'attempt-recorded': {},
        'max-attempts-exhausted': {},
    },
}
