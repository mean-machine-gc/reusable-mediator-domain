import type { CheckDeactivatableStateFn } from './check-deactivatable-state.spec'

export const checkDeactivatableState: CheckDeactivatableStateFn['signature'] = (mediation) => {
    if (mediation.status !== 'active')
        return { ok: false, errors: ['not_active'] }

    return { ok: true, value: mediation, successType: ['deactivatable-state-confirmed'] }
}
