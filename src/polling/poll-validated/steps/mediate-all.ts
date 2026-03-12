import type { MediateAllFn } from './mediate-all.spec'
import type { MediationOutcome } from '../../../incoming-processing/types'
import { mediateCore } from '../../../mediation/mediate/core/mediate'

export const mediateAll: MediateAllFn['signature'] = (input) => {
    const outcomes: MediationOutcome[] = []

    for (const mediation of input.mediations) {
        const result = mediateCore({
            event: input.event,
            mediation,
            registry: input.registry,
        })

        if (!result.ok) return result as any

        if (result.successType[0] === 'event-processed') {
            outcomes.push({
                result: 'dispatched',
                mediationId: mediation.id,
                destination: result.value.destination,
                event: result.value.event,
            })
        } else {
            outcomes.push({
                result: 'skipped',
                mediationId: mediation.id,
                destination: mediation.destination,
            })
        }
    }

    return { ok: true, value: outcomes, successType: ['all-mediated'] }
}
