import type { SafeResolveSchemaFn } from './safe-resolve-schema.spec'
import type { DomainDeps } from '../domain-deps'
import Ajv from 'ajv'

type SchemaValidator = (schema: unknown) => boolean

const safeResolveSchemaFactory =
    (validateSchema: SchemaValidator) =>
    (rawDep: DomainDeps['resolveSchema']): SafeResolveSchemaFn['asyncSignature'] =>
    async (uri) => {
        const raw = await rawDep(uri)
        if (raw.successType.includes('not-found')) {
            return { ok: true, value: null, successType: ['not-found'] }
        }
        if (!validateSchema(raw.value)) {
            return { ok: false, errors: ['invalid_schema'], details: ['Resolved value is not a valid JSON Schema'] }
        }
        return { ok: true, value: raw.value, successType: ['found'] }
    }

const ajv = new Ajv()
export const _safeResolveSchema = safeResolveSchemaFactory((schema) => {
    try {
        ajv.compile(schema as object)
        return true
    } catch {
        return false
    }
})
