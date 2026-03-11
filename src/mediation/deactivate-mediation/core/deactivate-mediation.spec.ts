// deactivate-mediation core spec
import type { FactorySpec } from '../../../shared/spec'
import type {
  Mediation, ActiveMediation, DraftMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'
import { checkDeactivatableStateSpec } from '../../shared/steps/check-deactivatable-state.spec'
import { assembleDeactivatedMediationSpec } from '../../shared/steps/assemble-deactivated-mediation.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type DeactivateMediationCommand = { mediationId: unknown }

type CoreInput = {
  cmd: DeactivateMediationCommand
  state: Mediation
  ctx: { deactivatedAt: DeactivatedAt }
}

type CoreOutput = DeactivatedMediation
type CoreFailure = 'not_active'
type CoreSuccess = 'mediation-deactivated'

export type { DeactivateMediationCommand, CoreInput, CoreOutput, CoreFailure, CoreSuccess }

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

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

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
  activatedAt,
  deactivatedAt: new Date('2024-01-03') as DeactivatedAt,
}

const expected: DeactivatedMediation = {
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
export const deactivateMediationCoreSpec: FactorySpec<
  CoreInput, CoreOutput, CoreFailure, CoreSuccess
> = {
  steps: {
    checkDeactivatableState: checkDeactivatableStateSpec,
    assembleDeactivatedMediation: assembleDeactivatedMediationSpec,
  },
  failures: {
    not_active: [
      { when: { cmd: validCmd, state: draftMediation, ctx: { deactivatedAt } } },
      { when: { cmd: validCmd, state: deactivatedMediation, ctx: { deactivatedAt } } },
    ],
  },
  successes: {
    'mediation-deactivated': {
      condition: () => true,
      examples: [
        { when: { cmd: validCmd, state: activeMediation, ctx: { deactivatedAt } }, then: expected },
      ],
    },
  },
}
