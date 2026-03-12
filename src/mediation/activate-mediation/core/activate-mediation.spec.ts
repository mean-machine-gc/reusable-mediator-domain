import type { SpecFn, Spec, StepInfo, AnyFn } from '../../../shared/spec-framework'
import type {
    Mediation,
    ActiveMediation,
    DraftMediation,
    DeactivatedMediation,
    ActivatedAt,
} from '../../types'
import { checkActivatableStateSpec } from '../../shared/steps/check-activatable-state.spec'
import { assembleActiveMediationSpec } from '../../shared/steps/assemble-active-mediation.spec'

type CoreInput = { state: Mediation; ctx: { activatedAt: ActivatedAt } }

export type ActivateMediationCoreFn = SpecFn<
    CoreInput,
    ActiveMediation,
    'already_active',
    'draft-activated' | 'reactivated'
>

const steps: StepInfo[] = [
    { name: 'checkActivatableState', type: 'step', description: 'Verify mediation is in draft or deactivated state', spec: checkActivatableStateSpec as unknown as Spec<AnyFn> },
    { name: 'assembleActiveMediation', type: 'step', description: 'Assemble active mediation from state and context', spec: assembleActiveMediationSpec as unknown as Spec<AnyFn> },
    { name: 'evaluateSuccessType', type: 'step', description: 'Classify the success outcome' },
]

const draftMediation: DraftMediation = {
    status: 'draft',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',

    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
}

const deactivatedMediation: DeactivatedMediation = {
    status: 'deactivated',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',

    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-15'),
    deactivatedAt: new Date('2025-02-01'),
}

const activatedAt = new Date('2025-01-15')
const reactivatedAt = new Date('2025-03-01')

export const activateMediationCoreSpec: Spec<ActivateMediationCoreFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'draft-activated': {
            description: 'A draft mediation becomes active',
            examples: [
                {
                    description: 'activating a draft mediation',
                    whenInput: { state: draftMediation, ctx: { activatedAt } },
                    then: {
                        status: 'active',
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        topic: 'patient.created',
                    
                        destination: 'https://example.com/webhook',
                        pipeline: [],
                        createdAt: new Date('2025-01-01'),
                        activatedAt,
                    },
                },
            ],
        },
        'reactivated': {
            description: 'A deactivated mediation becomes active again',
            examples: [
                {
                    description: 'reactivating a deactivated mediation',
                    whenInput: { state: deactivatedMediation, ctx: { activatedAt: reactivatedAt } },
                    then: {
                        status: 'active',
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        topic: 'patient.created',
                    
                        destination: 'https://example.com/webhook',
                        pipeline: [],
                        createdAt: new Date('2025-01-01'),
                        activatedAt: reactivatedAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'draft-activated': {
            'status-is-active': {
                description: 'Output status is active',
                assert: (_input, output) => output.status === 'active',
            },
            'input-was-draft': {
                description: 'Input state was draft',
                assert: (input, _output) => input.state.status === 'draft',
            },
        },
        'reactivated': {
            'status-is-active': {
                description: 'Output status is active',
                assert: (_input, output) => output.status === 'active',
            },
            'input-was-deactivated': {
                description: 'Input state was deactivated',
                assert: (input, _output) => input.state.status === 'deactivated',
            },
        },
    },
}
