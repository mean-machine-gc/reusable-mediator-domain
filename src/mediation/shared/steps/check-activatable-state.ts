import type { CheckActivatableStateFn } from './check-activatable-state.spec'

export const checkActivatableState: CheckActivatableStateFn['signature'] = (mediation) => {
    if (mediation.status === 'active')
        return { ok: false, errors: ['already_active'] }

    return { ok: true, value: mediation, successType: ['activatable-state-confirmed'] }
}
