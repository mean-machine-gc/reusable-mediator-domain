import type { ValidateProcessingShellFn } from './validate-processing.spec'
import type { IncomingProcessing, ValidatedProcessing, ValidatedAt } from '../types'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { ValidateProcessingFn } from './core/validate-processing.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { validateProcessing as validateProcessingCore } from './core/validate-processing'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
    validateProcessingCore: ValidateProcessingFn['signature']
}

type Deps = {
    loadState: (id: string) => Promise<IncomingProcessing | null>
    resolveSchema: (dataschemaUri: string) => Promise<object | null>
    generateValidatedAt: () => Promise<ValidatedAt>
    save: (aggregate: ValidatedProcessing) => Promise<void>
}

const validateProcessingShellFactory =
    (steps: Steps) =>
    (deps: Deps): ValidateProcessingShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseProcessingId(input.cmd.processingId)
        if (!parsed.ok) return parsed as any

        const state = await deps.loadState(parsed.value)
        if (!state) return { ok: false, errors: ['not_found'] } as any

        const schema = await deps.resolveSchema(state.dataschemaUri)
        if (!schema) return { ok: false, errors: ['schema_not_found'] } as any

        const validatedAt = await deps.generateValidatedAt()

        const result = steps.validateProcessingCore({
            cmd: { processingId: parsed.value },
            state,
            ctx: { schema, validatedAt },
        })
        if (!result.ok) return result as any

        await deps.save(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const validateProcessing = validateProcessingShellFactory({
    parseProcessingId,
    validateProcessingCore,
})
