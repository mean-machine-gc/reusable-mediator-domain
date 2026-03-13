import type { ValidateProcessingShellFn } from './validate-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { ValidateProcessingFn } from './core/validate-processing.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { validateProcessing as validateProcessingCore } from './core/validate-processing'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
    validateProcessingCore: ValidateProcessingFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    resolveSchema: DomainDeps['resolveSchema']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const validateProcessingShellFactory =
    (steps: Steps) =>
    (deps: Deps): ValidateProcessingShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseProcessingId(input.cmd.processingId)
        if (!parsed.ok) return parsed as any

        const stateResult = await deps.getIncomingProcessingById(parsed.value)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const schemaResult = await deps.resolveSchema(stateResult.value!.dataschemaUri)
        if (schemaResult.successType.includes('not-found')) return { ok: false, errors: ['schema_not_found'] } as any

        const validatedAtResult = await deps.generateTimestamp()
        const validatedAt = validatedAtResult.value

        const result = steps.validateProcessingCore({
            cmd: { processingId: parsed.value },
            state: stateResult.value!,
            ctx: { schema: schemaResult.value!, validatedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _validateProcessing = validateProcessingShellFactory({
    parseProcessingId,
    validateProcessingCore,
})
