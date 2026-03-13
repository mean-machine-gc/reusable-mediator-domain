import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { DraftMediation, FilterStep } from '../types'
import type { DomainDeps } from '../../domain-deps'
import type { CreateMediationCommand } from './command/command'
import { assembleDraftMediationSpec } from '../shared/steps/assemble-draft-mediation.spec'

type ShellInput = { cmd: CreateMediationCommand }

export type CreateMediationShellFn = SpecFn<
    ShellInput,
    DraftMediation,
    never,
    'mediation-created'
>

const steps: StepInfo[] = [
    { name: 'generateId', type: 'dep', description: 'Generate a unique mediation ID' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate creation timestamp' },
    { name: 'assembleDraftMediation', type: 'step', description: 'Assemble the draft mediation', spec: asStepSpec(assembleDraftMediationSpec) },
    { name: 'upsertMediation', type: 'dep', description: 'Persist the new mediation' },
]

// ── Test fixtures ────────────────────────────────────────────────────────

const generatedId = 'a0000000-0000-0000-0000-000000000001'
const fixedTimestamp = new Date('2025-06-15T10:31:00Z')

const filterStep: FilterStep = {
    type: 'filter',
    rules: {
        logic: 'and',
        conditions: [{ field: 'data.type', operator: 'equals', value: 'patient' }],
    },
}

// ── Test deps ────────────────────────────────────────────────────────────

export type CreateMediationDeps = Pick<DomainDeps, 'generateId' | 'generateTimestamp' | 'upsertMediation'>

export const testDeps: CreateMediationDeps = {
    generateId: async () => ({ ok: true, value: generatedId, successType: ['generated'] as 'generated'[] }),
    generateTimestamp: async () => ({ ok: true, value: fixedTimestamp, successType: ['generated'] as 'generated'[] }),
    upsertMediation: async () => ({ ok: true, value: undefined, successType: ['upserted'] as 'upserted'[] }),
}

// ── Spec ─────────────────────────────────────────────────────────────────

export const createMediationShellSpec: Spec<CreateMediationShellFn> = {
    document: true,
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'mediation-created': {
            description: 'A new draft mediation is created',
            examples: [
                {
                    description: 'creates a draft mediation with a filter pipeline',
                    whenInput: {
                        cmd: {
                            topic: 'patient.created',
                            destination: 'https://example.com/webhook',
                            pipeline: [filterStep],
                        },
                    },
                    then: {
                        status: 'draft',
                        id: generatedId,
                        topic: 'patient.created',
                        destination: 'https://example.com/webhook',
                        pipeline: [filterStep],
                        createdAt: fixedTimestamp,
                    },
                },
            ],
        },
    },
    shouldAssert: {
        'mediation-created': {},
    },
}
