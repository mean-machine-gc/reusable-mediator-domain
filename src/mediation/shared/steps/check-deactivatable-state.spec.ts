import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type {
    Mediation,
    DraftMediation,
    ActiveMediation,
    DeactivatedMediation,
} from '../../types'

export type CheckDeactivatableStateFn = SpecFn<
    Mediation,
    ActiveMediation,
    'not_active',
    'deactivatable-state-confirmed'
>

const draftMediation: DraftMediation = {
    status: 'draft',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',

    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
}

const activeMediation: ActiveMediation = {
    status: 'active',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',

    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-15'),
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

export const checkDeactivatableStateSpec: Spec<CheckDeactivatableStateFn> = {
    shouldFailWith: {
        not_active: {
            description: 'Mediation is not active',
            examples: [
                {
                    description: 'draft mediation cannot be deactivated',
                    whenInput: draftMediation,
                },
                {
                    description: 'already deactivated mediation',
                    whenInput: deactivatedMediation,
                },
            ],
        },
    },
    shouldSucceedWith: {
        'deactivatable-state-confirmed': {
            description: 'Mediation is active and can be deactivated',
            examples: [
                {
                    description: 'active mediation passes through',
                    whenInput: activeMediation,
                    then: activeMediation,
                },
            ],
        },
    },
    shouldAssert: {
        'deactivatable-state-confirmed': {
            'status-is-active': {
                description: 'Output status is active',
                assert: (_input, output) => output.status === 'active',
            },
        },
    },
}
