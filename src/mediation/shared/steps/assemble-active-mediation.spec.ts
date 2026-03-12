import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type {
    DraftMediation,
    DeactivatedMediation,
    ActiveMediation,
    ActivatedAt,
} from '../../types'

export type AssembleActiveMediationFn = SpecFn<
    { state: DraftMediation | DeactivatedMediation; ctx: { activatedAt: ActivatedAt } },
    ActiveMediation,
    never,
    'active-mediation-assembled'
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

const activatedAt = new Date('2025-01-15')
const reactivatedAt = new Date('2025-03-01')

export const assembleActiveMediationSpec: Spec<AssembleActiveMediationFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'active-mediation-assembled': {
            description: 'Assembles an active mediation from draft or deactivated state',
            examples: [
                {
                    description: 'from draft mediation',
                    whenInput: { state: draftMediation, ctx: { activatedAt } },
                    then: {
                        status: 'active',
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        topic: 'patient.created',
                        schema: null,
                        destination: 'https://example.com/webhook',
                        pipeline: [],
                        createdAt: new Date('2025-01-01'),
                        activatedAt,
                    },
                },
                {
                    description: 'from deactivated mediation',
                    whenInput: { state: deactivatedMediation, ctx: { activatedAt: reactivatedAt } },
                    then: {
                        status: 'active',
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        topic: 'patient.created',
                        schema: null,
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
        'active-mediation-assembled': {
            'status-is-active': {
                description: 'Output status is active',
                assert: (_input, output) => output.status === 'active',
            },
            'activated-at-set': {
                description: 'activatedAt is set from context',
                assert: (input, output) => output.activatedAt === input.ctx.activatedAt,
            },
        },
    },
}
