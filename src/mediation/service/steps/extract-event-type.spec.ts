import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { Topic } from '../../types'

// ── Output ──────────────────────────────────────────────────────────────────

export type ExtractedEventInfo = {
    topic: Topic
    dataschemaUri: string
}

// ── SpecFn ──────────────────────────────────────────────────────────────────

export type ExtractEventTypeFn = SpecFn<
    CloudEvent,
    ExtractedEventInfo,
    'missing_dataschema',
    'event-type-extracted'
>

// ── Fixtures ────────────────────────────────────────────────────────────────

const validEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient' },
} as unknown as CloudEvent

const eventWithoutSchema = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    data: { resourceType: 'Patient' },
} as unknown as CloudEvent

// ── Spec ────────────────────────────────────────────────────────────────────

export const extractEventTypeSpec: Spec<ExtractEventTypeFn> = {
    shouldFailWith: {
        missing_dataschema: {
            description: 'Event does not carry a dataschema attribute',
            examples: [
                {
                    description: 'rejects event without dataschema',
                    whenInput: eventWithoutSchema,
                },
            ],
        },
    },
    shouldSucceedWith: {
        'event-type-extracted': {
            description: 'Topic and dataschema URI extracted from the CloudEvent',
            examples: [
                {
                    description: 'extracts type and dataschema from a valid event',
                    whenInput: validEvent,
                    then: {
                        topic: 'org.openhim.patient.created.v1',
                        dataschemaUri: 'https://registry.example.com/schemas/patient-created/v1',
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'event-type-extracted': {
            'topic-matches-event-type': {
                description: 'Topic is the event type',
                assert: (input, output) => output.topic === (input as any).type,
            },
            'dataschema-matches-event': {
                description: 'dataschemaUri is the event dataschema',
                assert: (input, output) => output.dataschemaUri === (input as any).dataschema,
            },
        },
    },
}
