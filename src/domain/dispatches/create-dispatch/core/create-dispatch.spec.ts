import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CloudEvent } from 'cloudevents'
import type {
    DispatchId,
    CreatedAt,
    Dispatch,
    ToDeliverDispatch,
} from '../../types'
import type { ProcessingId, MediationId, Destination } from '../../../shared/types'

// ── Input ────────────────────────────────────────────────────────────────────

export type CreateDispatchCmd = {
    dispatchId: DispatchId
    processingId: ProcessingId
    mediationId: MediationId
    destination: Destination
    event: CloudEvent
}

export type CreateDispatchState = Dispatch | null

export type CreateDispatchCtx = {
    createdAt: CreatedAt
}

export type CreateDispatchInput = {
    cmd: CreateDispatchCmd
    state: CreateDispatchState
    ctx: CreateDispatchCtx
}

// ── SpecFn ───────────────────────────────────────────────────────────────────

export type CreateDispatchFn = SpecFn<
    CreateDispatchInput,
    ToDeliverDispatch,
    'already_exists',
    'dispatch-created'
>

// ── Fixtures ─────────────────────────────────────────────────────────────────

const event = {
    type: 'org.openhim.patient.created.v1',
    source: '/hapi-fhir',
    dataschema: 'https://registry.example.com/schemas/patient-created/v1',
    data: { resourceType: 'Patient', status: 'active', routed: true },
} as unknown as CloudEvent

const dispatchId = 'a0000000-0000-0000-0000-000000000001'
const processingId = '550e8400-e29b-41d4-a716-446655440000'
const mediationId = '00000000-0000-0000-0000-000000000001'
const destination = 'https://shr.example.com/fhir'
const createdAt = new Date('2025-06-15T10:31:00Z')

const existingDispatch: ToDeliverDispatch = {
    status: 'to-deliver',
    id: dispatchId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt,
}

// ── Spec ─────────────────────────────────────────────────────────────────────

export const createDispatchSpec: Spec<CreateDispatchFn> = {
    shouldFailWith: {
        already_exists: {
            description: 'A dispatch aggregate already exists for this ID',
            examples: [
                {
                    description: 'rejects when state is not null',
                    whenInput: {
                        cmd: { dispatchId, processingId, mediationId, destination, event },
                        state: existingDispatch,
                        ctx: { createdAt },
                    },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'dispatch-created': {
            description: 'A new ToDeliverDispatch aggregate is created',
            examples: [
                {
                    description: 'creates dispatch from mediation outcome',
                    whenInput: {
                        cmd: { dispatchId, processingId, mediationId, destination, event },
                        state: null,
                        ctx: { createdAt },
                    },
                    then: {
                        status: 'to-deliver',
                        id: dispatchId,
                        processingId,
                        mediationId,
                        destination,
                        event,
                        createdAt,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'dispatch-created': {
            'status-is-to-deliver': {
                description: 'Output status is to-deliver',
                assert: (_input, output) => output.status === 'to-deliver',
            },
            'id-from-cmd': {
                description: 'Dispatch ID comes from the command',
                assert: (input, output) => output.id === input.cmd.dispatchId,
            },
            'processingId-from-cmd': {
                description: 'Processing ID comes from the command',
                assert: (input, output) => output.processingId === input.cmd.processingId,
            },
            'mediationId-from-cmd': {
                description: 'Mediation ID comes from the command',
                assert: (input, output) => output.mediationId === input.cmd.mediationId,
            },
            'destination-from-cmd': {
                description: 'Destination comes from the command',
                assert: (input, output) => output.destination === input.cmd.destination,
            },
            'event-from-cmd': {
                description: 'Event comes from the command',
                assert: (input, output) => output.event === input.cmd.event,
            },
            'createdAt-from-ctx': {
                description: 'CreatedAt comes from the context',
                assert: (input, output) => output.createdAt === input.ctx.createdAt,
            },
        },
    },
}
