import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type {
    Topic,
    Destination,
    Pipeline,
    MediationId,
    CreatedAt,
    DraftMediation,
} from '../../types'

export type AssembleDraftMediationFn = SpecFn<
    {
        cmd: { topic: Topic; destination: Destination; pipeline: Pipeline }
        ctx: { id: MediationId; createdAt: CreatedAt }
    },
    DraftMediation,
    never,
    'draft-mediation-assembled'
>

const id = '550e8400-e29b-41d4-a716-446655440000'
const createdAt = new Date('2025-01-01')

export const assembleDraftMediationSpec: Spec<AssembleDraftMediationFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'draft-mediation-assembled': {
            description: 'Assembles a draft mediation from parsed command and context',
            examples: [
                {
                    description: 'with empty pipeline',
                    whenInput: {
                        cmd: {
                            topic: 'patient.created',
                            destination: 'https://example.com/webhook',
                            pipeline: [],
                        },
                        ctx: { id, createdAt },
                    },
                    then: {
                        status: 'draft',
                        id,
                        topic: 'patient.created',

                        destination: 'https://example.com/webhook',
                        pipeline: [],
                        createdAt,
                    },
                },
                {
                    description: 'with pipeline steps',
                    whenInput: {
                        cmd: {
                            topic: 'org.facility-registry.update',
                            destination: 'http://localhost:3000/callback',
                            pipeline: [
                                {
                                    type: 'filter',
                                    rules: {
                                        logic: 'and' as const,
                                        conditions: [
                                            { field: 'data.type', operator: 'equals' as const, value: 'facility' },
                                        ],
                                    },
                                },
                            ],
                        },
                        ctx: { id, createdAt },
                    },
                    then: {
                        status: 'draft',
                        id,
                        topic: 'org.facility-registry.update',

                        destination: 'http://localhost:3000/callback',
                        pipeline: [
                            {
                                type: 'filter',
                                rules: {
                                    logic: 'and' as const,
                                    conditions: [
                                        { field: 'data.type', operator: 'equals' as const, value: 'facility' },
                                    ],
                                },
                            },
                        ],
                        createdAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'draft-mediation-assembled': {
            'status-is-draft': {
                description: 'Output status is draft',
                assert: (_input, output) => output.status === 'draft',
            },
            'id-from-context': {
                description: 'ID is set from context',
                assert: (input, output) => output.id === input.ctx.id,
            },
            'created-at-from-context': {
                description: 'createdAt is set from context',
                assert: (input, output) => output.createdAt === input.ctx.createdAt,
            },
        },
    },
}
