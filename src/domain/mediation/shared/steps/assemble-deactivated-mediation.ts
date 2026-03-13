import type { AssembleDeactivatedMediationFn } from './assemble-deactivated-mediation.spec'

export const assembleDeactivatedMediation: AssembleDeactivatedMediationFn['signature'] = ({ state, ctx }) => {
    const { status, ...rest } = state

    return {
        ok: true,
        value: {
            ...rest,
            status: 'deactivated' as const,
            deactivatedAt: ctx.deactivatedAt,
        },
        successType: ['deactivated-mediation-assembled'],
    }
}
