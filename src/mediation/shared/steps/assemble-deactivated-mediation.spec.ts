// assemble-deactivated-mediation.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type {
  ActiveMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'

export type AssembleDeactivatedMediationFailure = never
export type AssembleDeactivatedMediationSuccess = 'deactivated-mediation-assembled'

type AssembleDeactivatedMediationInput = {
  state: ActiveMediation
  ctx: { deactivatedAt: DeactivatedAt }
}

export type { AssembleDeactivatedMediationInput }

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

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
  activatedAt,
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
export const assembleDeactivatedMediationSpec: FunctionSpec<
  AssembleDeactivatedMediationInput, DeactivatedMediation, AssembleDeactivatedMediationFailure, AssembleDeactivatedMediationSuccess
> = {
  constraints: {},
  successes: {
    'deactivated-mediation-assembled': {
      condition: () => true,
      assertions: {
        'status-is-deactivated': ({ output }) => output.status === 'deactivated',
        'id-preserved': ({ input, output }) => output.id === input.state.id,
        'topic-preserved': ({ input, output }) => output.topic === input.state.topic,
        'destination-preserved': ({ input, output }) => output.destination === input.state.destination,
        'pipeline-preserved': ({ input, output }) => output.pipeline === input.state.pipeline,
        'created-at-preserved': ({ input, output }) => output.createdAt === input.state.createdAt,
        'activated-at-preserved': ({ input, output }) => output.activatedAt === input.state.activatedAt,
        'deactivated-at-from-context': ({ input, output }) => output.deactivatedAt === input.ctx.deactivatedAt,
      },
      examples: [
        { when: { state: activeMediation, ctx: { deactivatedAt } }, then: expected },
      ],
    },
  },
}
