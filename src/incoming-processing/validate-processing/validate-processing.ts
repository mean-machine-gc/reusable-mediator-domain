import type { ValidateProcessingShellFn } from './validate-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ValidateProcessingFn } from './core/validate-processing.spec'
import { validateProcessing as validateProcessingCore } from './core/validate-processing'

type Steps = {
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
        const stateResult = await deps.getIncomingProcessingById(input.cmd.processingId)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const schemaResult = await deps.resolveSchema(stateResult.value!.dataschemaUri)
        if (schemaResult.successType.includes('not-found')) return { ok: false, errors: ['schema_not_found'] } as any

        const validatedAtResult = await deps.generateTimestamp()
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

export const _validateProcessing = validateProcessingShellFactory({
    validateProcessingCore,
})
