import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { Topic, MediationId } from '../../types'
import type { DispatchEntry, ServiceResult } from '../service.spec'
import type { CloudEvent } from 'cloudevents'

// ── SpecFn ──────────────────────────────────────────────────────────────────

export type EvaluateServiceSuccessTypeFn = SpecFn<
    { topic: Topic; dispatches: DispatchEntry[]; skipped: MediationId[] },
    ServiceResult,
    never,
    'events-dispatched' | 'all-skipped' | 'no-mediations'
>

// ── Fixtures ────────────────────────────────────────────────────────────────

const topic = 'org.openhim.patient.created.v1'

const sampleDispatch: DispatchEntry = {
    event: { type: topic } as unknown as CloudEvent,
    destination: 'https://shr.example.com/fhir',
    mediationId: '00000000-0000-0000-0000-000000000001',
}

// ── Spec ────────────────────────────────────────────────────────────────────

export const evaluateServiceSuccessTypeSpec: Spec<EvaluateServiceSuccessTypeFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'events-dispatched': {
            description: 'At least one mediation produced a dispatch',
            examples: [
                {
                    description: 'one dispatch, no skips',
                    whenInput: {
                        topic,
                        dispatches: [sampleDispatch],
                        skipped: [],
                    },
                    then: {
                        topic,
                        dispatches: [sampleDispatch],
                        skipped: [],
                    },
                },
                {
                    description: 'one dispatch, one skip',
                    whenInput: {
                        topic,
                        dispatches: [sampleDispatch],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                    then: {
                        topic,
                        dispatches: [sampleDispatch],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                },
            ],
        },
        'all-skipped': {
            description: 'Mediations were found but all filtered out the event',
            examples: [
                {
                    description: 'no dispatches, one skip',
                    whenInput: {
                        topic,
                        dispatches: [],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                    then: {
                        topic,
                        dispatches: [],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                },
            ],
        },
        'no-mediations': {
            description: 'No active mediations were found for this topic',
            examples: [
                {
                    description: 'no dispatches, no skips',
                    whenInput: {
                        topic,
                        dispatches: [],
                        skipped: [],
                    },
                    then: {
                        topic,
                        dispatches: [],
                        skipped: [],
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'events-dispatched': {
            'has-dispatches': {
                description: 'dispatches is non-empty',
                assert: (_input, output) => output.dispatches.length > 0,
            },
        },
        'all-skipped': {
            'no-dispatches': {
                description: 'dispatches is empty',
                assert: (_input, output) => output.dispatches.length === 0,
            },
            'has-skipped': {
                description: 'skipped is non-empty',
                assert: (_input, output) => output.skipped.length > 0,
            },
        },
        'no-mediations': {
            'both-empty': {
                description: 'dispatches and skipped are both empty',
                assert: (_input, output) =>
                    output.dispatches.length === 0 && output.skipped.length === 0,
            },
        },
    },
}
