import type { MediateAllFn } from './mediate-all.spec'
import type { DispatchEntry } from '../service.spec'
import type { MediationId } from '../../types'
import { mediateCore } from '../../mediate/core/mediate'

type Steps = {
    mediateCore: typeof mediateCore
}

const mediateAllFactory =
    (steps: Steps): MediateAllFn['signature'] =>
    (input) => {
        const dispatches: DispatchEntry[] = []
        const skipped: MediationId[] = []

        for (const mediation of input.mediations) {
            const result = steps.mediateCore({
                event: input.event,
                mediation,
                registry: input.registry,
            })

            if (!result.ok) return result as any

            if (result.successType?.includes('event-processed')) {
                dispatches.push({
                    event: result.value.event,
                    destination: result.value.destination,
                    mediationId: mediation.id,
                })
            } else {
                skipped.push(mediation.id)
            }
        }

        return {
            ok: true,
            value: { dispatches, skipped },
            successType: ['mediate-all-done'],
        }
    }

const steps: Steps = { mediateCore }
export const mediateAll = mediateAllFactory(steps)
