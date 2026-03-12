import type { AssembleActiveMediationFn } from './assemble-active-mediation.spec'

export const assembleActiveMediation: AssembleActiveMediationFn['signature'] = ({ state, ctx }) => {
    const { status, ...rest } = state
    const base = 'deactivatedAt' in rest
        ? (() => { const { deactivatedAt, ...withoutDeactivated } = rest; return withoutDeactivated })()
        : rest

    return {
        ok: true,
        value: {
            ...base,
            status: 'active' as const,
            activatedAt: ctx.activatedAt,
        },
        successType: ['active-mediation-assembled'],
    }
}
