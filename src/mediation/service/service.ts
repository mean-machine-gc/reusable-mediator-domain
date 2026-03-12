// handleEvent — shell factory
import type { MediationServiceFn } from './service.spec'
import type { ActiveMediation, TransformRegistry } from '../types'
import { extractEventType } from './steps/extract-event-type'
import { validateEventData } from './steps/validate-event-data'
import { mediateAll } from './steps/mediate-all'
import { evaluateServiceSuccessType } from './steps/evaluate-success-type'

type Steps = {
    extractEventType: typeof extractEventType
    validateEventData: typeof validateEventData
    mediateAll: typeof mediateAll
    evaluateServiceSuccessType: typeof evaluateServiceSuccessType
}

type Deps = {
    resolveSchema: (dataschemaUri: string) => Promise<object | null>
    findActiveMediationsByTopic: (topic: string) => Promise<ActiveMediation[]>
    getTransformRegistry: () => Promise<TransformRegistry>
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

        // 7. Classify outcome
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
    evaluateServiceSuccessType,
})
