import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { DeactivatedMediation, ActiveMediation, Mediation } from '../types'
import type { DomainDeps } from '../../domain-deps'
import type { DeactivateMediationCommand } from './command/command'
import { deactivateMediationCoreSpec } from './core/deactivate-mediation.spec'
import { safeGetMediationByIdSpec } from '../safe-get-mediation-by-id.spec'
import { safeGenerateTimestampSpec } from '../../shared/safe-generate-timestamp.spec'

type ShellInput = { cmd: DeactivateMediationCommand }

export type DeactivateMediationShellFn = SpecFn<
    ShellInput,
    DeactivatedMediation,
    'not_active' | 'not_found',
    'mediation-deactivated'
>

const steps: StepInfo[] = [
    { name: 'safeGetMediationById', type: 'safe-dep', description: 'Fetch and validate mediation from persistence', spec: asStepSpec(safeGetMediationByIdSpec) },
    { name: 'safeGenerateTimestamp', type: 'safe-dep', description: 'Generate and validate deactivation timestamp', spec: asStepSpec(safeGenerateTimestampSpec) },
    { name: 'deactivateMediationCore', type: 'step', description: 'Run deactivation core logic', spec: asStepSpec(deactivateMediationCoreSpec) },
    { name: 'upsertMediation', type: 'dep', description: 'Persist the deactivated mediation' },
]

// ── Test fixtures ────────────────────────────────────────────────────────

const notFoundId = 'a0000000-0000-0000-0000-000000000001'
const activeId = 'b0000000-0000-0000-0000-000000000001'
const fixedTimestamp = new Date('2025-06-15T10:40:00Z')
const createdAt = new Date('2025-06-15T10:30:00Z')
const activatedAt = new Date('2025-06-15T10:35:00Z')

const activeMediation: ActiveMediation = {
    status: 'active',
    id: activeId,
    topic: 'patient.created',
    destination: 'https://example.com/webhook',
    pipeline: [{ type: 'filter', rules: { logic: 'and', conditions: [{ field: 'data.type', operator: 'equals', value: 'patient' }] } }],
    createdAt,
    activatedAt,
}

// ── Test deps ────────────────────────────────────────────────────────────

export type DeactivateMediationDeps = Pick<DomainDeps, 'getMediationById' | 'generateTimestamp' | 'upsertMediation'>

const mediationStore: Record<string, Mediation> = {
    [activeId]: activeMediation,
}

export const testDeps: DeactivateMediationDeps = {
    getMediationById: async (id) =>
        id in mediationStore
            ? { ok: true, value: mediationStore[id], successType: ['found'] }
            : { ok: true, value: null, successType: ['not-found'] },
    generateTimestamp: async () => ({ ok: true, value: fixedTimestamp, successType: ['generated'] as 'generated'[] }),
    upsertMediation: async () => ({ ok: true, value: undefined, successType: ['upserted'] as 'upserted'[] }),
}

// ── Spec ─────────────────────────────────────────────────────────────────

export const deactivateMediationShellSpec: Spec<DeactivateMediationShellFn> = {
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
        'mediation-deactivated': {
            description: 'An active mediation becomes deactivated',
            examples: [
                {
                    description: 'deactivates an active mediation',
                    whenInput: { cmd: { mediationId: activeId } },
                    then: {
                        status: 'deactivated',
                        id: activeId,
                        topic: 'patient.created',
                        destination: 'https://example.com/webhook',
                        pipeline: activeMediation.pipeline,
                        createdAt,
                        activatedAt,
                        deactivatedAt: fixedTimestamp,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'mediation-deactivated': {},
    },
}
