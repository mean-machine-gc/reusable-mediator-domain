import type { AssembleDraftMediationFn } from './assemble-draft-mediation.spec'

export const assembleDraftMediation: AssembleDraftMediationFn['signature'] = ({ cmd, ctx }) => {
    return {
        ok: true,
        value: {
            status: 'draft' as const,
            id: ctx.id,
            topic: cmd.topic,
            schema: null,
            destination: cmd.destination,
            pipeline: cmd.pipeline,
            createdAt: ctx.createdAt,
        },
        successType: ['draft-mediation-assembled'],
    }
}
