// activate-mediation.spec.ts
import type { ShellFactorySpec, Result } from '../../shared/spec'
import type {
  ActiveMediation, DraftMediation, DeactivatedMediation, Mediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { activateMediationCoreSpec } from './core/activate-mediation.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type ActivateMediationCommand = { mediationId: unknown }

type ShellInput = { cmd: ActivateMediationCommand }
type ShellOutput = ActiveMediation

type ShellFailure =
  | 'not_a_string' | 'empty' | 'too_long_max_64' | 'not_a_uuid' | 'script_injection'
  | 'not_draft_or_deactivated'

type ShellSuccess = 'draft-activated' | 'reactivated'

type Deps = {
  findMediation: (id: MediationId) => Promise<Result<Mediation>>
  generateTimestamp: () => Promise<Result<ActivatedAt>>
  saveMediation: (mediation: ActiveMediation) => Promise<Result<ActiveMediation>>
}

export type { ActivateMediationCommand, ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps }

// ── Test data ──────────────────────────────────────────────────────────────
const mediationId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as MediationId
const topic = 'orders.order-created.v1' as Topic
const destination = 'https://openhim.example.org/adapter/dhis2/patient' as Destination
const createdAt = new Date('2024-01-01') as CreatedAt
const activatedAt = new Date('2024-01-02') as ActivatedAt
const deactivatedAt = new Date('2024-01-03') as DeactivatedAt

const pipeline: Pipeline = [
  {
    type: 'filter',
    rules: {
      logic: 'and',
      conditions: [
        { field: 'type' as FieldPath, operator: 'equals', value: 'patient-created' },
      ],
    },
  },
]

const validCmd: ActivateMediationCommand = { mediationId: mediationId }
const validInput: ShellInput = { cmd: validCmd }

const draftMediation: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
}

const deactivatedMediation: DeactivatedMediation = {
  status: 'deactivated',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt: new Date('2024-01-02') as ActivatedAt,
  deactivatedAt,
}

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt: new Date('2024-01-01') as ActivatedAt,
}

const expectedFromDraft: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

const expectedFromDeactivated: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const activateMediationShellSpec: ShellFactorySpec<
  ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps
> = {
  steps: {
    parseMediationId: parseMediationIdSpec,
    activateMediationCore: activateMediationCoreSpec,
  },
  deps: {
    findMediation: { failures: ['find_failed'] },
    generateTimestamp: { failures: ['generate_timestamp_failed'] },
    saveMediation: { failures: ['save_failed'] },
  },
  failures: {
    // parseMediationId failures
    not_a_string: [{ when: { cmd: { ...validCmd, mediationId: 42 } } }],
    empty: [{ when: { cmd: { ...validCmd, mediationId: '' } } }],
    too_long_max_64: [{ when: { cmd: { ...validCmd, mediationId: 'a'.repeat(65) } } }],
    not_a_uuid: [{ when: { cmd: { ...validCmd, mediationId: 'not-a-uuid' } } }],
    script_injection: [{ when: { cmd: { ...validCmd, mediationId: '<script>alert(1)</script>' } } }],
    // core failure (needs dep override — findMediation must return active mediation)
    not_draft_or_deactivated: [{ when: validInput }],
  },
  successes: {
    'draft-activated': {
      condition: () => true,
      examples: [
        { when: validInput, then: expectedFromDraft },
      ],
    },
    'reactivated': {
      condition: () => true,
      examples: [
        { when: validInput, then: expectedFromDeactivated },
      ],
    },
  },
  baseDeps: {
    findMediation: async () => ({ ok: true as const, value: draftMediation, successType: ['mediation-found'] }),
    generateTimestamp: async () => ({ ok: true as const, value: activatedAt, successType: ['timestamp-generated'] }),
    saveMediation: async (mediation) => ({ ok: true as const, value: mediation, successType: ['mediation-saved'] }),
  },
  baseDepsOverrides: {
    not_draft_or_deactivated: {
      findMediation: async () => ({ ok: true as const, value: activeMediation, successType: ['mediation-found'] }),
    },
    reactivated: {
      findMediation: async () => ({ ok: true as const, value: deactivatedMediation, successType: ['mediation-found'] }),
    },
  },
  depPropagation: {
    findMediation: { when: validInput, failsWith: 'find_failed' },
    generateTimestamp: { when: validInput, failsWith: 'generate_timestamp_failed' },
    saveMediation: { when: validInput, failsWith: 'save_failed' },
  },
}
