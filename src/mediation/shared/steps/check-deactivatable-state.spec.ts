// check-deactivatable-state.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type {
  Mediation, ActiveMediation, DraftMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'

export type CheckDeactivatableStateFailure = 'not_active'
export type CheckDeactivatableStateSuccess = 'deactivatable-state-confirmed'

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
export const checkDeactivatableStateSpec: FunctionSpec<
  Mediation, ActiveMediation, CheckDeactivatableStateFailure, CheckDeactivatableStateSuccess
> = {
  constraints: {
    not_active: {
      predicate: ({ input }) => input.status === 'active',
      examples: [
        { when: draftMediation },
        { when: deactivatedMediation },
      ],
    },
  },
  successes: {
    'deactivatable-state-confirmed': {
      condition: () => true,
      assertions: {
        'same-mediation-returned': ({ input, output }) => output.id === input.id,
        'status-is-active': ({ output }) => output.status === 'active',
      },
      examples: [
        { when: activeMediation, then: activeMediation },
      ],
    },
  },
}
