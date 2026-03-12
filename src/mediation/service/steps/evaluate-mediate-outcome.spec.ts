import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { MediationId, Topic } from '../../types'
import type { DispatchEntry, ServiceResult } from '../service.spec'
import type { CloudEvent } from 'cloudevents'

// ── Output ──────────────────────────────────────────────────────────────────
// When there are dispatches, returns them for the next step (dispatchAll).
// When there are none, short-circuits with the final ServiceResult.

export type MediateOutcome =
    | { action: 'dispatch'; dispatches: DispatchEntry[] }
    | { action: 'done'; result: ServiceResult }

// ── SpecFn ──────────────────────────────────────────────────────────────────

export type EvaluateMediateOutcomeFn = SpecFn<
    { topic: Topic; dispatches: DispatchEntry[]; skipped: MediationId[] },
    MediateOutcome,
    never,
    'has-dispatches' | 'all-skipped' | 'no-mediations'
>

// ── Fixtures ────────────────────────────────────────────────────────────────

const topic = 'org.openhim.patient.created.v1'

const sampleDispatch: DispatchEntry = {
    event: { type: topic } as unknown as CloudEvent,
    destination: 'https://shr.example.com/fhir',
    mediationId: '00000000-0000-0000-0000-000000000001',
}

// ── Spec ────────────────────────────────────────────────────────────────────

export const evaluateMediateOutcomeSpec: Spec<EvaluateMediateOutcomeFn> = {
    shouldFailWith: {},
    shouldSucceedWith: {
        'has-dispatches': {
            description: 'There are dispatches to send — pipeline continues',
            examples: [
                {
                    description: 'one dispatch, no skips',
                    whenInput: { topic, dispatches: [sampleDispatch], skipped: [] },
                    then: { action: 'dispatch', dispatches: [sampleDispatch] },
                },
                {
                    description: 'one dispatch, one skip',
                    whenInput: {
                        topic,
                        dispatches: [sampleDispatch],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                    then: { action: 'dispatch', dispatches: [sampleDispatch] },
                },
            ],
        },
        'all-skipped': {
            description: 'Mediations found but all filtered out — pipeline ends',
            examples: [
                {
                    description: 'no dispatches, one skip',
                    whenInput: {
                        topic,
                        dispatches: [],
                        skipped: ['00000000-0000-0000-0000-000000000002'],
                    },
                    then: {
                        action: 'done',
                        result: {
                            topic,
                            dispatches: [],
                            skipped: ['00000000-0000-0000-0000-000000000002'],
                        },
                    },
                },
            ],
        },
        'no-mediations': {
            description: 'No mediations found — pipeline ends',
            examples: [
                {
                    description: 'no dispatches, no skips',
                    whenInput: { topic, dispatches: [], skipped: [] },
                    then: {
                        action: 'done',
                        result: { topic, dispatches: [], skipped: [] },
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'has-dispatches': {
            'action-is-dispatch': {
                description: 'Action is dispatch',
                assert: (_input, output) => output.action === 'dispatch',
            },
            'dispatches-non-empty': {
                description: 'Dispatches list is non-empty',
                assert: (_input, output) =>
                    output.action === 'dispatch' && output.dispatches.length > 0,
            },
        },
        'all-skipped': {
            'action-is-done': {
                description: 'Action is done',
                assert: (_input, output) => output.action === 'done',
            },
        },
        'no-mediations': {
            'action-is-done': {
                description: 'Action is done',
                assert: (_input, output) => output.action === 'done',
            },
        },
    },
}
