// check-activatable-state.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type {
  Mediation, DraftMediation, ActiveMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'

export type CheckActivatableStateFailure = 'not_draft_or_deactivated'
export type CheckActivatableStateSuccess = 'activatable-state-confirmed'

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
export const checkActivatableStateSpec: FunctionSpec<
  Mediation, DraftMediation | DeactivatedMediation, CheckActivatableStateFailure, CheckActivatableStateSuccess
> = {
  constraints: {
    not_draft_or_deactivated: {
      predicate: ({ input }) => input.status === 'draft' || input.status === 'deactivated',
      examples: [{ when: activeMediation }],
    },
  },
  successes: {
    'activatable-state-confirmed': {
      condition: () => true,
      assertions: {
        'same-mediation-returned': ({ input, output }) => output.id === input.id,
      },
      examples: [
        { when: draftMediation, then: draftMediation },
        { when: deactivatedMediation, then: deactivatedMediation },
      ],
    },
  },
}
