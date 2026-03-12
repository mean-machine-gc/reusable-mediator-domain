import type { ValidateEventDataFn } from './validate-event-data.spec'
import Ajv from 'ajv'

const ajv = new Ajv()

export const validateEventData: ValidateEventDataFn['signature'] = ({ data, schema }) => {
    const validate = ajv.compile(schema)
    const valid = validate(data)

    if (!valid) {
        return { ok: false, errors: ['schema_validation_failed'] }
    }

    return {
        ok: true,
        value: data,
        successType: ['event-data-valid'],
    }
}
