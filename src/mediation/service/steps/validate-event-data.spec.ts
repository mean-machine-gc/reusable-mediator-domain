import type { SpecFn, Spec } from '../../../shared/spec-framework'

// ── SpecFn ──────────────────────────────────────────────────────────────────
// Input: the event data (unknown) and the resolved JSON Schema (object).
// Output: the validated data passed through unchanged.
// This is a gate step — it either passes or fails, never transforms.

export type ValidateEventDataFn = SpecFn<
    { data: unknown; schema: object },
    unknown,
    'schema_validation_failed',
    'event-data-valid'
>

// ── Fixtures ────────────────────────────────────────────────────────────────

const patientSchema = {
    type: 'object',
    required: ['resourceType'],
    properties: {
        resourceType: { type: 'string', enum: ['Patient'] },
        status: { type: 'string' },
    },
}

// ── Spec ────────────────────────────────────────────────────────────────────

export const validateEventDataSpec: Spec<ValidateEventDataFn> = {
    shouldFailWith: {
        schema_validation_failed: {
            description: 'Event data does not conform to the resolved JSON Schema',
            examples: [
                {
                    description: 'rejects data missing a required field',
                    whenInput: {
                        data: { status: 'active' },
                        schema: patientSchema,
                    },
                },
                {
                    description: 'rejects data with wrong type for a field',
                    whenInput: {
                        data: { resourceType: 123 },
                        schema: patientSchema,
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'event-data-valid': {
            description: 'Event data conforms to the schema',
            examples: [
                {
                    description: 'valid patient resource passes validation',
                    whenInput: {
                        data: { resourceType: 'Patient', status: 'active' },
                        schema: patientSchema,
                    },
                    then: { resourceType: 'Patient', status: 'active' },
                },
                {
                    description: 'minimal valid data with only required fields',
                    whenInput: {
                        data: { resourceType: 'Patient' },
                        schema: patientSchema,
                    },
                    then: { resourceType: 'Patient' },
                },
            ],
        },
    },
    shouldAssert: {
        'event-data-valid': {
            'data-passes-through': {
                description: 'Validated data is returned unchanged',
                assert: (input, output) => JSON.stringify(output) === JSON.stringify(input.data),
            },
        },
    },
}
