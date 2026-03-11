// delete-mediation.spec.ts
import type { ShellFactorySpec, Result } from '../../shared/spec'
import type {
  DraftMediation, DeactivatedMediation, ActiveMediation, Mediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { deleteMediationCoreSpec } from './core/delete-mediation.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type DeleteMediationCommand = { mediationId: unknown }

type ShellInput = { cmd: DeleteMediationCommand }
type ShellOutput = DraftMediation | DeactivatedMediation

type ShellFailure =
  | 'not_a_string' | 'empty' | 'too_long_max_64' | 'not_a_uuid' | 'script_injection'
  | 'not_draft_or_deactivated'

type ShellSuccess = 'mediation-deleted'

type Deps = {
  findMediation: (id: MediationId) => Promise<Result<Mediation>>
  deleteMediation: (mediation: DraftMediation | DeactivatedMediation) => Promise<Result<DraftMediation | DeactivatedMediation>>
}

export type { DeleteMediationCommand, ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps }

// ── Test data ──────────────────────────────────────────────────────────────
const mediationId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as MediationId
const topic = 'orders.order-created.v1' as Topic
const destination = 'https://openhim.example.org/adapter/dhis2/patient' as Destination
const createdAt = new Date('2024-01-01') as CreatedAt
const activatedAt = new Date('2024-01-02') as ActivatedAt

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

const validCmd: DeleteMediationCommand = { mediationId }
const validInput: ShellInput = { cmd: validCmd }

const draftMediation: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
}

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const deleteMediationShellSpec: ShellFactorySpec<
  ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps
> = {
  steps: {
    parseMediationId: parseMediationIdSpec,
    deleteMediationCore: deleteMediationCoreSpec,
  },
  deps: {
    findMediation: { failures: ['find_failed'] },
    deleteMediation: { failures: ['delete_failed'] },
  },
  failures: {
    // parseMediationId failures
    not_a_string: [{ when: { cmd: { ...validCmd, mediationId: 42 } } }],
    empty: [{ when: { cmd: { ...validCmd, mediationId: '' } } }],
    too_long_max_64: [{ when: { cmd: { ...validCmd, mediationId: 'a'.repeat(65) } } }],
    not_a_uuid: [{ when: { cmd: { ...validCmd, mediationId: 'not-a-uuid' } } }],
    script_injection: [{ when: { cmd: { ...validCmd, mediationId: '<script>alert(1)</script>' } } }],
    // core failure
    not_draft_or_deactivated: [{ when: validInput }],
  },
  successes: {
    'mediation-deleted': {
      condition: () => true,
      examples: [
        { when: validInput, then: draftMediation },
      ],
    },
  },
  baseDeps: {
    findMediation: async () => ({ ok: true as const, value: draftMediation, successType: ['mediation-found'] }),
    deleteMediation: async (mediation) => ({ ok: true as const, value: mediation, successType: ['mediation-deleted'] }),
  },
  baseDepsOverrides: {
    not_draft_or_deactivated: {
      findMediation: async () => ({ ok: true as const, value: activeMediation, successType: ['mediation-found'] }),
    },
  },
  depPropagation: {
    findMediation: { when: validInput, failsWith: 'find_failed' },
    deleteMediation: { when: validInput, failsWith: 'delete_failed' },
  },
}
