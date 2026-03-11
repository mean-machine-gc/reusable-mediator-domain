// activate-mediation core spec
import type { FactorySpec } from '../../../shared/spec'
import type {
  Mediation, ActiveMediation, DraftMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'
import { checkActivatableStateSpec } from '../../shared/steps/check-activatable-state.spec'
import { assembleActiveMediationSpec } from '../../shared/steps/assemble-active-mediation.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type ActivateMediationCommand = { mediationId: unknown }

type CoreInput = {
  cmd: ActivateMediationCommand
  state: Mediation
  ctx: { activatedAt: ActivatedAt }
}

type CoreOutput = ActiveMediation
type CoreFailure = 'not_draft_or_deactivated'
type CoreSuccess = 'draft-activated' | 'reactivated'

export type { ActivateMediationCommand, CoreInput, CoreOutput, CoreFailure, CoreSuccess }

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
  activatedAt: new Date('2024-01-02') as ActivatedAt,
  deactivatedAt,
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
export const activateMediationCoreSpec: FactorySpec<
  CoreInput, CoreOutput, CoreFailure, CoreSuccess
> = {
  steps: {
    checkActivatableState: checkActivatableStateSpec,
    assembleActiveMediation: assembleActiveMediationSpec,
  },
  failures: {
    not_draft_or_deactivated: [
      { when: { cmd: validCmd, state: activeMediation, ctx: { activatedAt } } },
    ],
  },
  successes: {
    'draft-activated': {
      condition: ({ input }) => input.state.status === 'draft',
      examples: [
        { when: { cmd: validCmd, state: draftMediation, ctx: { activatedAt } }, then: expectedFromDraft },
      ],
    },
    'reactivated': {
      condition: ({ input }) => input.state.status === 'deactivated',
      examples: [
        { when: { cmd: validCmd, state: deactivatedMediation, ctx: { activatedAt } }, then: expectedFromDeactivated },
      ],
    },
  },
}
