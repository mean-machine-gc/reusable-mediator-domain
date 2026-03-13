import type { ValidateProcessingFn } from './validate-processing.spec'
import Ajv from 'ajv'

const ajv = new Ajv()

export const validateProcessing: ValidateProcessingFn['signature'] = ({ state, ctx }) => {
    if (state.status !== 'received')
        return { ok: false, errors: ['not_in_received_state'] }

    const validate = ajv.compile(ctx.schema)
    const valid = validate((state.event as any).data)

    if (!valid) {
        return { ok: false, errors: ['schema_validation_failed'] }
    }

    return {
        ok: true,
        value: {
            status: 'validated',
            id: state.id,
            event: state.event,
            topic: state.topic,
            dataschemaUri: state.dataschemaUri,
            receivedAt: state.receivedAt,
            validatedAt: ctx.validatedAt,
        },
        successType: ['processing-validated'],
    }
}
