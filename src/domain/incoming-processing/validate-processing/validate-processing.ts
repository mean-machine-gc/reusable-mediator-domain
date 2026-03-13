import type { ValidateProcessingShellFn } from './validate-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ValidateProcessingFn } from './core/validate-processing.spec'
import { validateProcessing as validateProcessingCore } from './core/validate-processing'
import { _safeGetIncomingProcessingById } from '../safe-get-incoming-processing-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'
import { _safeResolveSchema } from '../../shared/safe-resolve-schema'

type ShellSteps = {
    safeGetIncomingProcessingById: typeof _safeGetIncomingProcessingById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    safeResolveSchema: typeof _safeResolveSchema
    validateProcessingCore: ValidateProcessingFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    resolveSchema: DomainDeps['resolveSchema']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const validateProcessingShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): ValidateProcessingShellFn['asyncSignature'] => {
    const getIncomingProcessingById = steps.safeGetIncomingProcessingById(deps.getIncomingProcessingById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)
    const resolveSchema = steps.safeResolveSchema(deps.resolveSchema)

    return async (input) => {
        const stateResult = await getIncomingProcessingById(input.cmd.processingId)
        if (!stateResult.ok) return stateResult as any
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const schemaResult = await resolveSchema(stateResult.value!.dataschemaUri)
        if (!schemaResult.ok) return schemaResult as any
        if (schemaResult.successType.includes('not-found')) return { ok: false, errors: ['schema_not_found'] } as any

        const validatedAtResult = await generateTimestamp()
        if (!validatedAtResult.ok) return validatedAtResult as any
        const validatedAt = validatedAtResult.value

        const result = steps.validateProcessingCore({
            cmd: { processingId: input.cmd.processingId },
            state: stateResult.value!,
            ctx: { schema: schemaResult.value!, validatedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }
    }

export const _validateProcessing = validateProcessingShellFactory({
    safeGetIncomingProcessingById: _safeGetIncomingProcessingById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    safeResolveSchema: _safeResolveSchema,
    validateProcessingCore,
})
