import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type {
    Mediation,
    DraftMediation,
    ActiveMediation,
    DeactivatedMediation,
} from '../../types'

export type CheckActivatableStateFn = SpecFn<
    Mediation,
    DraftMediation | DeactivatedMediation,
    'already_active',
    'activatable-state-confirmed'
>

const draftMediation: DraftMediation = {
    status: 'draft',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',
    schema: null,
    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
}

const activeMediation: ActiveMediation = {
    status: 'active',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',
    schema: null,
    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-15'),
}

const deactivatedMediation: DeactivatedMediation = {
    status: 'deactivated',
    id: '550e8400-e29b-41d4-a716-446655440000',
    topic: 'patient.created',
    schema: null,
    destination: 'https://example.com/webhook',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-15'),
    deactivatedAt: new Date('2025-02-01'),
}

export const checkActivatableStateSpec: Spec<CheckActivatableStateFn> = {
    shouldFailWith: {
        already_active: {
            description: 'Mediation is already active',
            examples: [
                {
                    description: 'active mediation',
                    whenInput: activeMediation,
                },
            ],
        },
    },
    shouldSucceedWith: {
        'activatable-state-confirmed': {
            description: 'Mediation is in an activatable state (draft or deactivated)',
            examples: [
                {
                    description: 'draft mediation passes through',
                    whenInput: draftMediation,
                    then: draftMediation,
                },
                {
                    description: 'deactivated mediation passes through',
                    whenInput: deactivatedMediation,
                    then: deactivatedMediation,
                },
            ],
        },
    },
    shouldAssert: {
        'activatable-state-confirmed': {
            'status-is-draft-or-deactivated': {
                description: 'Output status is draft or deactivated',
                assert: (_input, output) =>
                    output.status === 'draft' || output.status === 'deactivated',
            },
        },
    },
}
