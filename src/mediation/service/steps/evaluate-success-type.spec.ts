import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { Topic, MediationId } from '../../types'
import type { DispatchEntry, ServiceResult } from '../service.spec'
import type { CloudEvent } from 'cloudevents'

// ── SpecFn ──────────────────────────────────────────────────────────────────
// This step is only reached after successful dispatch.
// It assembles the final ServiceResult with success type 'events-dispatched'.

export type EvaluateServiceSuccessTypeFn = SpecFn<
    { topic: Topic; dispatches: DispatchEntry[]; skipped: MediationId[] },
    ServiceResult,
    never,
    'events-dispatched'
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
            description: 'Events have been dispatched to their destinations',
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
    },
    shouldAssert: {
        'events-dispatched': {
            'has-dispatches': {
                description: 'dispatches is non-empty',
                assert: (_input, output) => output.dispatches.length > 0,
            },
        },
    },
}
