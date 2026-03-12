// mediate core factory
import type { CloudEvent } from 'cloudevents'
import type { Result } from '../../../shared/spec'
import type { ActiveMediation, FilterStep, TransformStep, TransformRegistry } from '../../types'

// ── Types ──────────────────────────────────────────────────────────────────────

export type CoreInput = { event: CloudEvent; mediation: ActiveMediation; registry: TransformRegistry }
export type CoreOutput = CloudEvent
export type CoreFailure = ExecuteFiltersFailure | ExecuteTransformsFailure
export type CoreSuccess = 'event-processed' | 'event-skipped'

export type ExecuteFiltersFailure = string // TBD — will narrow when step is specced
export type ExecuteFiltersSuccess = 'filters-passed' | 'event-skipped'

export type ExecuteTransformsFailure = 'unknown_transform'
export type ExecuteTransformsSuccess = 'transforms-applied'

// ── Steps ──────────────────────────────────────────────────────────────────────

type CoreSteps = {
  executeFilters: (input: {
    event: CloudEvent
    filters: FilterStep[]
  }) => Result<CloudEvent, ExecuteFiltersFailure, ExecuteFiltersSuccess>

  executeTransforms: (input: {
    event: CloudEvent
    transforms: TransformStep[]
    registry: TransformRegistry
  }) => Result<CloudEvent, ExecuteTransformsFailure, ExecuteTransformsSuccess>
}

// ── Factory ────────────────────────────────────────────────────────────────────

export const mediateCoreFactory =
  (steps: CoreSteps) =>
  (input: CoreInput): Result<CoreOutput, CoreFailure, CoreSuccess> => {
    // 1. extract filter and transform steps from pipeline
    const filters = input.mediation.pipeline.filter(s => s.type === 'filter') as FilterStep[]
    const transforms = input.mediation.pipeline.filter(s => s.type === 'transform') as TransformStep[]

    // 2. execute filters — if event was skipped, return early
    const filterResult = steps.executeFilters({ event: input.event, filters })
    if (!filterResult.ok) return filterResult as unknown as Result<CoreOutput, CoreFailure, CoreSuccess>
    if (filterResult.successType?.includes('event-skipped'))
      return { ok: true, value: input.event, successType: ['event-skipped'] }

    // 3. execute transforms — apply transformations to the event
    const transformResult = steps.executeTransforms({ event: input.event, transforms, registry: input.registry })
    if (!transformResult.ok) return transformResult as unknown as Result<CoreOutput, CoreFailure, CoreSuccess>

    // 4. return processed event
    return { ok: true, value: transformResult.value, successType: ['event-processed'] }
  }
