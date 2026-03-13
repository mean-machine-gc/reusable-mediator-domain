import type { SpecFn, Spec, StepInfo } from '../../../shared/spec-framework'
import { asStepSpec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type { ActiveMediation, TransformRegistry } from '../../../mediation/types'
import type { MediationOutcome } from '../../../incoming-processing/types'
import { mediateCoreSpec } from '../../../mediation/mediate/core/mediate.spec'

// ── Input ────────────────────────────────────────────────────────────────────

export type MediateAllInput = {
    event: CloudEvent
    mediations: ActiveMediation[]
    registry: TransformRegistry
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type MediateAllFn = SpecFn<
    MediateAllInput,
    MediationOutcome[],
    'unknown_transform',
    'all-mediated'
>

// ── Steps ────────────────────────────────────────────────────────────────────

const steps: StepInfo[] = [
    { name: 'mediateCore', type: 'step', description: 'Run mediation pipeline (filter/transform) for a single mediation', spec: asStepSpec(mediateCoreSpec) },
]

// ── Fixtures ─────────────────────────────────────────────────────────────────

const event = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    data: { status: 'active' },
} as unknown as CloudEvent

const mediationA: ActiveMediation = {
    status: 'active',
    id: '00000000-0000-0000-0000-000000000001',
    topic: 'orders.created',
    destination: 'https://example.com/a',
    pipeline: [],
    createdAt: new Date('2025-01-01'),
    activatedAt: new Date('2025-01-02'),
}

const mediationB: ActiveMediation = {
    status: 'active',
    id: '00000000-0000-0000-0000-000000000002',
    topic: 'orders.created',
    destination: 'https://example.com/b',
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

// ── Spec ─────────────────────────────────────────────────────────────────────

export const mediateAllSpec: Spec<MediateAllFn> = {
    document: true,
    steps,
    shouldFailWith: {
        unknown_transform: {
            description: 'A mediation references an unknown transform in its pipeline',
            examples: [
                {
                    description: 'one mediation has unknown transform',
                    whenInput: {
                        event,
                        mediations: [{
                            ...mediationA,
                            pipeline: [{ type: 'transform', rules: ['nonexistent'] }],
                        }],
                        registry: {},
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'all-mediated': {
            description: 'All mediations processed, outcomes collected as dispatched or skipped',
            examples: [
                {
                    description: 'two mediations — one dispatched, one skipped by filter',
                    whenInput: {
                        event,
                        mediations: [mediationA, mediationB],
                        registry: {},
                    },
                    then: [
                        {
                            result: 'dispatched',
                            mediationId: mediationA.id,
                            destination: 'https://example.com/a',
                            event,
                        },
                        {
                            result: 'skipped',
                            mediationId: mediationB.id,
                            destination: 'https://example.com/b',
                        },
                    ],
                },
                {
                    description: 'no mediations produces empty outcomes',
                    whenInput: {
                        event,
                        mediations: [],
                        registry: {},
                    },
                    then: [],
                },
            ],
        },
    },
    shouldAssert: {
        'all-mediated': {
            'outcomes-match-mediations': {
                description: 'One outcome per mediation',
                assert: (input, output) => output.length === input.mediations.length,
            },
            'all-mediation-ids-present': {
                description: 'Every mediation ID appears in the outcomes',
                assert: (input, output) =>
                    input.mediations.every(m => output.some(o => o.mediationId === m.id)),
            },
            'dispatched-have-event': {
                description: 'Every dispatched outcome includes the event',
                assert: (_input, output) =>
                    output.filter(o => o.result === 'dispatched').every(o => 'event' in o),
            },
        },
    },
}
