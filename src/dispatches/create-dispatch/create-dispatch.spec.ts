import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ToDeliverDispatch, Dispatch } from '../types'
import type { DomainDeps } from '../../domain-deps'
import { createDispatchSpec } from './core/create-dispatch.spec'
import { CloudEvent } from 'cloudevents'

type ShellInput = {
    cmd: {
        dispatchId: string
        processingId: string
        mediationId: string
        destination: string
        event: unknown
    }
}

export type CreateDispatchShellFn = SpecFn<
    ShellInput,
    ToDeliverDispatch,
    'already_exists',
    'dispatch-created'
>

const steps: StepInfo[] = [
    { name: 'getDispatchById', type: 'dep', description: 'Load existing aggregate state from persistence (null if not found)' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate created timestamp from clock' },
    { name: 'createDispatchCore', type: 'step', description: 'Validate state gate and assemble ToDeliverDispatch', spec: asStepSpec(createDispatchSpec) },
    { name: 'upsertDispatch', type: 'dep', description: 'Persist the new aggregate' },
]

// ── Test fixtures ────────────────────────────────────────────────────────

const newId = 'b0000000-0000-0000-0000-000000000001'
const existingId = 'a0000000-0000-0000-0000-000000000001'
const processingId = '7ba7b810-9dad-11d1-80b4-00c04fd430c8'
const mediationId = '8ba7b810-9dad-11d1-80b4-00c04fd430c8'
const destination = 'https://downstream.example.com/webhook'
const event = new CloudEvent({ type: 'patient.created', source: '/test', id: '1' })
const fixedTimestamp = new Date('2025-06-15T10:31:00Z')

const existingDispatch: ToDeliverDispatch = {
    status: 'to-deliver',
    id: existingId,
    processingId,
    mediationId,
    destination,
    event,
    createdAt: fixedTimestamp,
}

// ── Test deps ────────────────────────────────────────────────────────────

export type CreateDispatchDeps = Pick<DomainDeps, 'getDispatchById' | 'generateTimestamp' | 'upsertDispatch'>

const dispatchStore: Record<string, Dispatch> = {
    [existingId]: existingDispatch,
}

export const testDeps: CreateDispatchDeps = {
    getDispatchById: async (id) =>
        id in dispatchStore
            ? { ok: true, value: dispatchStore[id], successType: ['found'] }
            : { ok: true, value: null, successType: ['not-found'] },
    generateTimestamp: async () => ({ ok: true, value: fixedTimestamp, successType: ['generated'] }),
    upsertDispatch: async () => ({ ok: true, value: undefined, successType: ['upserted'] }),
}

// ── Spec ─────────────────────────────────────────────────────────────────

export const createDispatchShellSpec: Spec<CreateDispatchShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        already_exists: {
            description: 'A dispatch aggregate already exists for this ID',
            examples: [
                {
                    description: 'rejects when dispatch already exists',
                    whenInput: { cmd: { dispatchId: existingId, processingId, mediationId, destination, event } },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'dispatch-created': {
            description: 'A new dispatch is created in to-deliver state',
            examples: [
                {
                    description: 'creates a new dispatch',
                    whenInput: { cmd: { dispatchId: newId, processingId, mediationId, destination, event } },
                    then: {
                        status: 'to-deliver',
                        id: newId,
                        processingId,
                        mediationId,
                        destination,
                        event,
                        createdAt: fixedTimestamp,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'dispatch-created': {},
    },
}
