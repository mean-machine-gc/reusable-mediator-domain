// delete-mediation core spec
import type { FactorySpec } from '../../../shared/spec'
import type {
  Mediation, DraftMediation, ActiveMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'
import { checkDeletableStateSpec } from '../../shared/steps/check-deletable-state.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type DeleteMediationCommand = { mediationId: unknown }

type CoreInput = {
  cmd: DeleteMediationCommand
  state: Mediation
}

type CoreOutput = DraftMediation | DeactivatedMediation
type CoreFailure = 'not_draft_or_deactivated'
type CoreSuccess = 'mediation-deleted'

export type { DeleteMediationCommand, CoreInput, CoreOutput, CoreFailure, CoreSuccess }

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

const validCmd: DeleteMediationCommand = { mediationId }

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

const deactivatedMediation: DeactivatedMediation = {
  status: 'deactivated',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt,
  deactivatedAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const deleteMediationCoreSpec: FactorySpec<
  CoreInput, CoreOutput, CoreFailure, CoreSuccess
> = {
  steps: {
    checkDeletableState: checkDeletableStateSpec,
  },
  failures: {
    not_draft_or_deactivated: [
      { when: { cmd: validCmd, state: activeMediation } },
    ],
  },
  successes: {
    'mediation-deleted': {
      condition: () => true,
      examples: [
        { when: { cmd: validCmd, state: draftMediation }, then: draftMediation },
        { when: { cmd: validCmd, state: deactivatedMediation }, then: deactivatedMediation },
      ],
    },
  },
}
