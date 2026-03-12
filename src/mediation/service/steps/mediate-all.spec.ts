import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { ActiveMediation, MediationId, TransformRegistry } from '../../types'
import type { DispatchEntry } from '../service.spec'

// ── Output ──────────────────────────────────────────────────────────────────

export type MediateAllResult = {
    dispatches: DispatchEntry[]
    skipped: MediationId[]
}

// ── SpecFn ──────────────────────────────────────────────────────────────────

export type MediateAllFn = SpecFn<
    { event: CloudEvent; mediations: ActiveMediation[]; registry: TransformRegistry },
    MediateAllResult,
    'unknown_transform',
    'mediate-all-done'
>

// ── Fixtures ────────────────────────────────────────────────────────────────

const baseEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    data: { resourceType: 'Patient', status: 'active' },
} as unknown as CloudEvent

const transformedEvent = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    data: { resourceType: 'Patient', status: 'active', routed: true },
} as unknown as CloudEvent

const matchingMediation: ActiveMediation = {
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

const skippingMediation: ActiveMediation = {
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

const brokenMediation: ActiveMediation = {
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

const registry: TransformRegistry = {
    addRouteFlag: () => transformedEvent,
}

// ── Spec ────────────────────────────────────────────────────────────────────

export const mediateAllSpec: Spec<MediateAllFn> = {
    shouldFailWith: {
        unknown_transform: {
            description: 'A mediation pipeline references a transform not in the registry',
            examples: [
                {
                    description: 'fails on first mediation with unknown transform',
                    whenInput: {
                        event: baseEvent,
                        mediations: [brokenMediation],
                        registry: {},
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'mediate-all-done': {
            description: 'All mediations have been processed — dispatches and skips collected',
            examples: [
                {
                    description: 'one dispatched, one skipped',
                    whenInput: {
                        event: baseEvent,
                        mediations: [matchingMediation, skippingMediation],
                        registry,
                    },
                    then: {
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
                {
                    description: 'all skipped',
                    whenInput: {
                        event: baseEvent,
                        mediations: [skippingMediation],
                        registry: {},
                    },
                    then: {
                        dispatches: [],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                },
                {
                    description: 'empty mediations list',
                    whenInput: {
                        event: baseEvent,
                        mediations: [],
                        registry: {},
                    },
                    then: {
                        dispatches: [],
                        skipped: [],
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'mediate-all-done': {
            'dispatch-count-plus-skip-count-equals-mediations': {
                description: 'Every mediation is accounted for in dispatches or skipped',
                assert: (input, output) =>
                    output.dispatches.length + output.skipped.length === input.mediations.length,
            },
        },
    },
}
