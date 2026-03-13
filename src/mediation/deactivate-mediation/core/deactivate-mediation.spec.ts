import type { SpecFn, Spec, StepInfo } from '../../../shared/spec-framework'
import { asStepSpec } from '../../../shared/spec-framework'
import type {
    Mediation,
    ActiveMediation,
    DeactivatedMediation,
    DeactivatedAt,
} from '../../types'
import { checkDeactivatableStateSpec } from '../../shared/steps/check-deactivatable-state.spec'
import { assembleDeactivatedMediationSpec } from '../../shared/steps/assemble-deactivated-mediation.spec'

type CoreInput = { state: Mediation; ctx: { deactivatedAt: DeactivatedAt } }

export type DeactivateMediationCoreFn = SpecFn<
    CoreInput,
    DeactivatedMediation,
    'not_active',
    'mediation-deactivated'
>

const steps: StepInfo[] = [
    { name: 'checkDeactivatableState', type: 'step', description: 'Verify mediation is in active state', spec: asStepSpec(checkDeactivatableStateSpec) },
    { name: 'assembleDeactivatedMediation', type: 'step', description: 'Assemble deactivated mediation', spec: asStepSpec(assembleDeactivatedMediationSpec) },
    { name: 'evaluateSuccessType', type: 'step', description: 'Classify the success outcome' },
]

const activeMediation: ActiveMediation = {
    status: 'active',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',

    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-15'),
}

const deactivatedAt = new Date('2025-02-01')

export const deactivateMediationCoreSpec: Spec<DeactivateMediationCoreFn> = {
    document: true,
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'mediation-deactivated': {
            description: 'An active mediation becomes deactivated',
            examples: [
                {
                    description: 'deactivating an active mediation',
                    whenInput: { state: activeMediation, ctx: { deactivatedAt } },
                    then: {
                        status: 'deactivated',
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        topic: 'patient.created',
                    
                        destination: 'https://example.com/webhook',
                        pipeline: [],
                        createdAt: new Date('2025-01-01'),
                        activatedAt: new Date('2025-01-15'),
                        deactivatedAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'mediation-deactivated': {
            'status-is-deactivated': {
                description: 'Output status is deactivated',
                assert: (_input, output) => output.status === 'deactivated',
            },
            'deactivated-at-set': {
                description: 'deactivatedAt is set from context',
                assert: (input, output) => output.deactivatedAt === input.ctx.deactivatedAt,
            },
        },
    },
}
