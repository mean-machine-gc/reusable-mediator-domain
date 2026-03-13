import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { ActiveMediation, DraftMediation, DeactivatedMediation, Mediation } from '../types'
import type { DomainDeps } from '../../domain-deps'
import type { ActivateMediationCommand } from './command/command'
import { activateMediationCoreSpec } from './core/activate-mediation.spec'
import { safeGetMediationByIdSpec } from '../safe-get-mediation-by-id.spec'
import { safeGenerateTimestampSpec } from '../../shared/safe-generate-timestamp.spec'

type ShellInput = { cmd: ActivateMediationCommand }

export type ActivateMediationShellFn = SpecFn<
    ShellInput,
    ActiveMediation,
    'already_active' | 'not_found',
    'draft-activated' | 'reactivated'
>

const steps: StepInfo[] = [
    { name: 'safeGetMediationById', type: 'safe-dep', description: 'Fetch and validate mediation from persistence', spec: asStepSpec(safeGetMediationByIdSpec) },
    { name: 'safeGenerateTimestamp', type: 'safe-dep', description: 'Generate and validate activation timestamp', spec: asStepSpec(safeGenerateTimestampSpec) },
    { name: 'activateMediationCore', type: 'step', description: 'Run activation core logic', spec: asStepSpec(activateMediationCoreSpec) },
    { name: 'upsertMediation', type: 'dep', description: 'Persist the activated mediation' },
]

// ── Test fixtures ────────────────────────────────────────────────────────

const notFoundId = 'a0000000-0000-0000-0000-000000000001'
const draftId = 'b0000000-0000-0000-0000-000000000001'
const deactivatedId = 'c0000000-0000-0000-0000-000000000001'
const fixedTimestamp = new Date('2025-06-15T10:35:00Z')
const createdAt = new Date('2025-06-15T10:30:00Z')

const draftMediation: DraftMediation = {
    status: 'draft',
    id: draftId,
    topic: 'patient.created',
    destination: 'https://example.com/webhook',
    pipeline: [{ type: 'filter', rules: { logic: 'and', conditions: [{ field: 'data.type', operator: 'equals', value: 'patient' }] } }],
    createdAt,
}

const deactivatedMediation: DeactivatedMediation = {
    status: 'deactivated',
    id: deactivatedId,
    topic: 'patient.created',
    destination: 'https://example.com/webhook',
    pipeline: [{ type: 'filter', rules: { logic: 'and', conditions: [{ field: 'data.type', operator: 'equals', value: 'patient' }] } }],
    createdAt,
    activatedAt: new Date('2025-06-15T10:32:00Z'),
    deactivatedAt: new Date('2025-06-15T10:34:00Z'),
}

// ── Test deps ────────────────────────────────────────────────────────────

export type ActivateMediationDeps = Pick<DomainDeps, 'getMediationById' | 'generateTimestamp' | 'upsertMediation'>

const mediationStore: Record<string, Mediation> = {
    [draftId]: draftMediation,
    [deactivatedId]: deactivatedMediation,
}

export const testDeps: ActivateMediationDeps = {
    getMediationById: async (id) =>
        id in mediationStore
            ? { ok: true, value: mediationStore[id], successType: ['found'] }
            : { ok: true, value: null, successType: ['not-found'] },
    generateTimestamp: async () => ({ ok: true, value: fixedTimestamp, successType: ['generated'] as 'generated'[] }),
    upsertMediation: async () => ({ ok: true, value: undefined, successType: ['upserted'] as 'upserted'[] }),
}

// ── Spec ─────────────────────────────────────────────────────────────────

export const activateMediationShellSpec: Spec<ActivateMediationShellFn> = {
    document: true,
    steps,
    shouldFailWith: {
        not_found: {
            description: 'No mediation aggregate exists for this ID',
            examples: [
                {
                    description: 'rejects when mediation not found',
                    whenInput: { cmd: { mediationId: notFoundId } },
                },
            ],
        },
    },
    shouldSucceedWith: {
        'draft-activated': {
            description: 'A draft mediation becomes active',
            examples: [
                {
                    description: 'activates a draft mediation',
                    whenInput: { cmd: { mediationId: draftId } },
                    then: {
                        status: 'active',
                        id: draftId,
                        topic: 'patient.created',
                        destination: 'https://example.com/webhook',
                        pipeline: draftMediation.pipeline,
                        createdAt,
                        activatedAt: fixedTimestamp,
                    },
                },
            ],
        },
        'reactivated': {
            description: 'A deactivated mediation becomes active again',
            examples: [
                {
                    description: 'reactivates a deactivated mediation',
                    whenInput: { cmd: { mediationId: deactivatedId } },
                    then: {
                        status: 'active',
                        id: deactivatedId,
                        topic: 'patient.created',
                        destination: 'https://example.com/webhook',
                        pipeline: deactivatedMediation.pipeline,
                        createdAt,
                        activatedAt: fixedTimestamp,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'draft-activated': {},
        'reactivated': {},
    },
}
