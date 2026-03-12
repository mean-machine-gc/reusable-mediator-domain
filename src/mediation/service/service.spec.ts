import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { ActiveMediation, Destination, MediationId, Topic } from '../types'
import { extractEventTypeSpec } from './steps/extract-event-type.spec'
import { validateEventDataSpec } from './steps/validate-event-data.spec'
import { mediateAllSpec } from './steps/mediate-all.spec'
import { evaluateServiceSuccessTypeSpec } from './steps/evaluate-success-type.spec'

// ── Output ──────────────────────────────────────────────────────────────────

export type DispatchEntry = {
    event: CloudEvent
    destination: Destination
    mediationId: MediationId
}

export type ServiceResult = {
    topic: Topic
    dispatches: DispatchEntry[]
    skipped: MediationId[]
}

// ── SpecFn ──────────────────────────────────────────────────────────────────

export type MediationServiceFn = SpecFn<
    { event: CloudEvent },
    ServiceResult,
    | 'missing_dataschema'
    | 'schema_not_found'
    | 'schema_validation_failed'
    | 'unknown_transform',
    'events-dispatched' | 'all-skipped' | 'no-mediations'
>

// ── Steps ───────────────────────────────────────────────────────────────────

const steps: StepInfo[] = [
    { name: 'extractEventType', type: 'step', description: 'Read event.type as the topic and validate dataschema presence', spec: extractEventTypeSpec as unknown as Spec<AnyFn> },
    { name: 'resolveSchema', type: 'dep', description: 'Fetch JSON Schema from registry using event.dataschema URI' },
    { name: 'validateEventData', type: 'step', description: 'Validate event.data against the resolved schema', spec: validateEventDataSpec as unknown as Spec<AnyFn> },
    { name: 'findActiveMediationsByTopic', type: 'dep', description: 'Fetch all active mediations whose topic matches the event type' },
    { name: 'getTransformRegistry', type: 'dep', description: 'Retrieve the transform function registry' },
    { name: 'mediateAll', type: 'step', description: 'Run mediateCore for each mediation and collect results', spec: mediateAllSpec as unknown as Spec<AnyFn> },
    { name: 'evaluateSuccessType', type: 'step', description: 'Classify outcome based on dispatches and skipped counts', spec: evaluateServiceSuccessTypeSpec as unknown as Spec<AnyFn> },
]

// ── Fixtures ────────────────────────────────────────────────────────────────

const baseEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active' },
} as unknown as CloudEvent

const eventWithoutSchema = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    data: { resourceType: 'Patient', status: 'active' },
} as unknown as CloudEvent

const transformedEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active', routed: true },
} as unknown as CloudEvent

const mediationA: ActiveMediation = {
    status: 'active',
    id: '00000000-0000-0000-0000-000000000001',
    topic: 'org.openhim.patient.created.v1',
    destination: 'https://shr.example.com/fhir',
    pipeline: [
        {
            type: 'filter',
            rules: {
                logic: 'and',
                conditions: [
                    { field: 'data.resourceType', operator: 'equals', value: 'Patient' },
                ],
            },
        },
        { type: 'transform', rules: ['addRouteFlag'] },
    ],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-02'),
}

const mediationB: ActiveMediation = {
    status: 'active',
    id: '00000000-0000-0000-0000-000000000002',
    topic: 'org.openhim.patient.created.v1',
    destination: 'https://audit.example.com/log',
    pipeline: [
        {
            type: 'filter',
            rules: {
                logic: 'and',
                conditions: [
                    { field: 'data.status', operator: 'equals', value: 'inactive' },
                ],
            },
        },
    ],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-02'),
}

const mediationBroken: ActiveMediation = {
    status: 'active',
    id: '00000000-0000-0000-0000-000000000003',
    topic: 'org.openhim.patient.created.v1',
    destination: 'https://broken.example.com',
    pipeline: [
        { type: 'transform', rules: ['nonexistent'] },
    ],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-02'),
}

// ── Spec ────────────────────────────────────────────────────────────────────

export const mediationServiceSpec: Spec<MediationServiceFn> = {
    steps,
    shouldFailWith: {
        missing_dataschema: {
            description: 'Event does not carry a dataschema attribute',
            examples: [
                {
                    description: 'rejects event without dataschema',
                    whenInput: { event: eventWithoutSchema },
                },
            ],
        },
        schema_not_found: {
            description: 'The dataschema URI does not resolve to a known schema',
            examples: [
                {
                    description: 'registry returns nothing for the dataschema URI',
                    whenInput: { event: baseEvent },
                },
            ],
        },
        schema_validation_failed: {
            description: 'Event data does not conform to the resolved schema',
            examples: [
                {
                    description: 'event data fails JSON Schema validation',
                    whenInput: { event: baseEvent },
                },
            ],
        },
        unknown_transform: {
            description: 'A mediation references a transform not in the registry',
            examples: [
                {
                    description: 'fails when a mediation pipeline uses an unknown transform',
                    whenInput: { event: baseEvent },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'events-dispatched': {
            description: 'At least one mediation processed the event and produced a dispatch',
            examples: [
                {
                    description: 'one mediation matches, one skips — dispatches the match',
                    whenInput: { event: baseEvent },
                    then: {
                        topic: 'org.openhim.patient.created.v1',
                        dispatches: [
                            {
                                event: transformedEvent,
                                destination: 'https://shr.example.com/fhir',
                                mediationId: '00000000-0000-0000-0000-000000000001',
                            },
                        ],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                },
            ],
        },
        'all-skipped': {
            description: 'All active mediations filtered out the event',
            examples: [
                {
                    description: 'event does not match any mediation filters',
                    whenInput: { event: baseEvent },
                    then: {
                        topic: 'org.openhim.patient.created.v1',
                        dispatches: [],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                },
            ],
        },
        'no-mediations': {
            description: 'No active mediations are registered for this event type',
            examples: [
                {
                    description: 'event type has no matching mediations',
                    whenInput: { event: baseEvent },
                    then: {
                        topic: 'org.openhim.patient.created.v1',
                        dispatches: [],
                        skipped: [],
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'events-dispatched': {
            'at-least-one-dispatch': {
                description: 'There is at least one dispatch entry',
                assert: (_input, output) => output.dispatches.length > 0,
            },
            'topic-matches-event-type': {
                description: 'Output topic matches the input event type',
                assert: (input, output) => output.topic === (input.event as any).type,
            },
        },
        'all-skipped': {
            'no-dispatches': {
                description: 'Dispatches array is empty',
                assert: (_input, output) => output.dispatches.length === 0,
            },
            'at-least-one-skipped': {
                description: 'At least one mediation was skipped',
                assert: (_input, output) => output.skipped.length > 0,
            },
        },
        'no-mediations': {
            'empty-results': {
                description: 'Both dispatches and skipped are empty',
                assert: (_input, output) => output.dispatches.length === 0 && output.skipped.length === 0,
            },
        },
    },
}
