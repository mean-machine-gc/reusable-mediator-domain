// assemble-draft-mediation.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type {
  DraftMediation, MediationId, Topic, Destination,
  Pipeline, CreatedAt, FieldPath,
} from '../../types'

export type AssembleDraftMediationFailure = never
export type AssembleDraftMediationSuccess = 'draft-mediation-assembled'

type AssembleDraftMediationInput = {
  cmd: { topic: Topic; destination: Destination; pipeline: Pipeline }
  ctx: { id: MediationId; createdAt: CreatedAt }
}

// ── Test data ──────────────────────────────────────────────────────────────
const mediationId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as MediationId
const topic = 'orders.order-created.v1' as Topic
const destination = 'https://openhim.example.org/adapter/dhis2/patient' as Destination
const createdAt = new Date('2024-01-01') as CreatedAt

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

const validInput: AssembleDraftMediationInput = {
  cmd: { topic, destination, pipeline },
  ctx: { id: mediationId, createdAt },
}

const expectedDraft: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline,
  createdAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const assembleDraftMediationSpec: FunctionSpec<
  AssembleDraftMediationInput, DraftMediation, AssembleDraftMediationFailure, AssembleDraftMediationSuccess
> = {
  constraints: {},
  successes: {
    'draft-mediation-assembled': {
      condition: () => true,
      assertions: {
        'status-is-draft': ({ output }) => output.status === 'draft',
        'id-from-context': ({ input, output }) => output.id === input.ctx.id,
        'topic-from-command': ({ input, output }) => output.topic === input.cmd.topic,
        'destination-from-command': ({ input, output }) => output.destination === input.cmd.destination,
        'pipeline-from-command': ({ input, output }) => output.pipeline === input.cmd.pipeline,
        'created-at-from-context': ({ input, output }) => output.createdAt === input.ctx.createdAt,
      },
      examples: [
        { when: validInput, then: expectedDraft },
      ],
    },
  },
}
