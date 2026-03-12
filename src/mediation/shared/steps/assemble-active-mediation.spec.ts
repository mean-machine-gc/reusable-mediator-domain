// assemble-active-mediation.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type {
  ActiveMediation, DraftMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'

export type AssembleActiveMediationFailure = never
export type AssembleActiveMediationSuccess = 'active-mediation-assembled'

type AssembleActiveMediationInput = {
  state: DraftMediation | DeactivatedMediation
  ctx: { activatedAt: ActivatedAt }
}

export type { AssembleActiveMediationInput }

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
  schema: {},
  destination,
  pipeline,
  createdAt,
}

const deactivatedMediation: DeactivatedMediation = {
  status: 'deactivated',
  id: mediationId,
  topic,
  schema: {},
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
  schema: {},
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

const expectedFromDeactivated: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline,
  createdAt,
  activatedAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const assembleActiveMediationSpec: FunctionSpec<
  AssembleActiveMediationInput, ActiveMediation, AssembleActiveMediationFailure, AssembleActiveMediationSuccess
> = {
  constraints: {},
  successes: {
    'active-mediation-assembled': {
      condition: () => true,
      assertions: {
        'status-is-active': ({ output }) => output.status === 'active',
        'id-preserved': ({ input, output }) => output.id === input.state.id,
        'topic-preserved': ({ input, output }) => output.topic === input.state.topic,
        'destination-preserved': ({ input, output }) => output.destination === input.state.destination,
        'pipeline-preserved': ({ input, output }) => output.pipeline === input.state.pipeline,
        'created-at-preserved': ({ input, output }) => output.createdAt === input.state.createdAt,
        'activated-at-from-context': ({ input, output }) => output.activatedAt === input.ctx.activatedAt,
      },
      examples: [
        { when: { state: draftMediation, ctx: { activatedAt } }, then: expectedFromDraft },
        { when: { state: deactivatedMediation, ctx: { activatedAt } }, then: expectedFromDeactivated },
      ],
    },
  },
}
