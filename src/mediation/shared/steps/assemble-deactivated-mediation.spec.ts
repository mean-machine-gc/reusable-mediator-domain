import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ActiveMediation, DeactivatedMediation, DeactivatedAt } from '../../types'

export type AssembleDeactivatedMediationFn = SpecFn<
    { state: ActiveMediation; ctx: { deactivatedAt: DeactivatedAt } },
    DeactivatedMediation,
    never,
    'deactivated-mediation-assembled'
>

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

export const assembleDeactivatedMediationSpec: Spec<AssembleDeactivatedMediationFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'deactivated-mediation-assembled': {
            description: 'Assembles a deactivated mediation from an active state',
            examples: [
                {
                    description: 'from active mediation',
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
        'deactivated-mediation-assembled': {
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
