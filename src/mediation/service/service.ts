// handleEvent — shell factory
import type { MediationServiceFn, DispatchEntry } from './service.spec'
import type { ActiveMediation, TransformRegistry } from '../types'
import type { ExtractEventTypeFn } from './steps/extract-event-type.spec'
import type { ValidateEventDataFn } from './steps/validate-event-data.spec'
import type { MediateAllFn } from './steps/mediate-all.spec'
import type { EvaluateMediateOutcomeFn } from './steps/evaluate-mediate-outcome.spec'
import type { EvaluateServiceSuccessTypeFn } from './steps/evaluate-success-type.spec'
import { extractEventType } from './steps/extract-event-type'
import { validateEventData } from './steps/validate-event-data'
import { mediateAll } from './steps/mediate-all'
import { evaluateMediateOutcome } from './steps/evaluate-mediate-outcome'
import { evaluateServiceSuccessType } from './steps/evaluate-success-type'

type Steps = {
    extractEventType: ExtractEventTypeFn['signature']
    validateEventData: ValidateEventDataFn['signature']
    mediateAll: MediateAllFn['signature']
    evaluateMediateOutcome: EvaluateMediateOutcomeFn['signature']
    evaluateServiceSuccessType: EvaluateServiceSuccessTypeFn['signature']
}

type Deps = {
    resolveSchema: (dataschemaUri: string) => Promise<object | null>
    findActiveMediationsByTopic: (topic: string) => Promise<ActiveMediation[]>
    getTransformRegistry: () => Promise<TransformRegistry>
    dispatchAll: (dispatches: DispatchEntry[]) => Promise<void>
}

const handleEventFactory =
    (steps: Steps) =>
    (deps: Deps): MediationServiceFn['asyncSignature'] => {
    return async (input) => {
        // 1. Extract topic + dataschema URI from event
        const extracted = steps.extractEventType(input.event)
        if (!extracted.ok) return extracted as any

        // 2. Resolve schema from registry
        const schema = await deps.resolveSchema(extracted.value.dataschemaUri)
        if (!schema) {
            return { ok: false, errors: ['schema_not_found'] }
        }

        // 3. Validate event data against schema
        const validation = steps.validateEventData({ data: (input.event as any).data, schema })
        if (!validation.ok) return validation as any

        // 4. Fetch active mediations by topic
        const mediations = await deps.findActiveMediationsByTopic(extracted.value.topic)

        // 5. Get transform registry
        const registry = await deps.getTransformRegistry()

        // 6. Run mediateCore for each mediation
        const mediateResult = steps.mediateAll({ event: input.event, mediations, registry })
        if (!mediateResult.ok) return mediateResult as any

        // 7. Evaluate mediate outcome — short-circuit if nothing to dispatch
        const outcome = steps.evaluateMediateOutcome({
            topic: extracted.value.topic,
            dispatches: mediateResult.value.dispatches,
            skipped: mediateResult.value.skipped,
        })
        if (!outcome.ok) return outcome as any

        if (outcome.value.action === 'done') {
            const successType = outcome.successType as any
            return { ok: true, value: outcome.value.result, successType }
        }

        // 8. Dispatch all processed events to their destinations
        try {
            await deps.dispatchAll(outcome.value.dispatches)
        } catch {
            return { ok: false, errors: ['dispatch_failed'] }
        }

        // 9. Assemble final result
        const result = steps.evaluateServiceSuccessType({
            topic: extracted.value.topic,
            dispatches: mediateResult.value.dispatches,
            skipped: mediateResult.value.skipped,
        })
        if (!result.ok) return result as any

        return {
            ok: true,
            value: result.value,
            successType: result.successType,
        }
    }
    }

// Steps baked in — app layer provides deps
export const handleEvent = handleEventFactory({
    extractEventType,
    validateEventData,
    mediateAll,
    evaluateMediateOutcome,
    evaluateServiceSuccessType,
})
