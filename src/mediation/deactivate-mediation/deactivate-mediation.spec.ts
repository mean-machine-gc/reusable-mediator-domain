// deactivate-mediation.spec.ts
import type { ShellFactorySpec, Result } from '../../shared/spec'
import type {
  ActiveMediation, DeactivatedMediation, Mediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { deactivateMediationCoreSpec } from './core/deactivate-mediation.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type DeactivateMediationCommand = { mediationId: unknown }

type ShellInput = { cmd: DeactivateMediationCommand }
type ShellOutput = DeactivatedMediation

type ShellFailure =
  | 'not_a_string' | 'empty' | 'too_long_max_64' | 'not_a_uuid' | 'script_injection'
  | 'not_active'

type ShellSuccess = 'mediation-deactivated'

type Deps = {
  findMediation: (id: MediationId) => Promise<Result<Mediation>>
  generateTimestamp: () => Promise<Result<DeactivatedAt>>
  saveMediation: (mediation: DeactivatedMediation) => Promise<Result<DeactivatedMediation>>
}

export type { DeactivateMediationCommand, ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps }

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

const validCmd: DeactivateMediationCommand = { mediationId }
const validInput: ShellInput = { cmd: validCmd }

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

const draftMediation = {
  status: 'draft' as const,
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline,
  createdAt,
}

const expected: DeactivatedMediation = {
  status: 'deactivated',
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline,
  createdAt,
  activatedAt,
  deactivatedAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const deactivateMediationShellSpec: ShellFactorySpec<
  ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps
> = {
  steps: {
    parseMediationId: parseMediationIdSpec,
    deactivateMediationCore: deactivateMediationCoreSpec,
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
    // core failure
    not_active: [{ when: validInput }],
  },
  successes: {
    'mediation-deactivated': {
      condition: () => true,
      examples: [
        { when: validInput, then: expected },
      ],
    },
  },
  baseDeps: {
    findMediation: async () => ({ ok: true as const, value: activeMediation, successType: ['mediation-found'] }),
    generateTimestamp: async () => ({ ok: true as const, value: deactivatedAt, successType: ['timestamp-generated'] }),
    saveMediation: async (mediation) => ({ ok: true as const, value: mediation, successType: ['mediation-saved'] }),
  },
  baseDepsOverrides: {
    not_active: {
      findMediation: async () => ({ ok: true as const, value: draftMediation, successType: ['mediation-found'] }),
    },
  },
  depPropagation: {
    findMediation: { when: validInput, failsWith: 'find_failed' },
    generateTimestamp: { when: validInput, failsWith: 'generate_timestamp_failed' },
    saveMediation: { when: validInput, failsWith: 'save_failed' },
  },
}
