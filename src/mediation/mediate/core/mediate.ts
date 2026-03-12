// mediate core factory
import type { MediateCoreFn } from './mediate.spec'
import type { FilterStep, TransformStep } from '../../types'
import { executeFilters } from '../steps/execute-filters'
import { executeTransforms } from '../steps/execute-transforms'

type CoreSteps = {
    executeFilters: typeof executeFilters
    executeTransforms: typeof executeTransforms
}

const mediateCoreFactory =
    (steps: CoreSteps): MediateCoreFn['signature'] =>
    (input) => {
        const filters = input.mediation.pipeline.filter(s => s.type === 'filter') as FilterStep[]
        const transforms = input.mediation.pipeline.filter(s => s.type === 'transform') as TransformStep[]

        const filterResult = steps.executeFilters({ event: input.event, filters })
        if (!filterResult.ok) return filterResult as any
        const destination = input.mediation.destination

        if (filterResult.successType?.includes('event-skipped'))
            return { ok: true, value: { event: input.event, destination }, successType: ['event-skipped'] }

        const transformResult = steps.executeTransforms({ event: input.event, transforms, registry: input.registry })
        if (!transformResult.ok) return transformResult as any

        return { ok: true, value: { event: transformResult.value, destination }, successType: ['event-processed'] }
    }

const coreSteps: CoreSteps = { executeFilters, executeTransforms }
export const mediateCore = mediateCoreFactory(coreSteps)
