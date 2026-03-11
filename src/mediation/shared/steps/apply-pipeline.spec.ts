// apply-pipeline.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type {
  DraftMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'

export type ApplyPipelineFailure = never
export type ApplyPipelineSuccess = 'pipeline-applied'

type ApplyPipelineInput = {
  state: DraftMediation | DeactivatedMediation
  pipeline: Pipeline
}

export type { ApplyPipelineInput }

// ── Test data ──────────────────────────────────────────────────────────────
const mediationId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as MediationId
const topic = 'orders.order-created.v1' as Topic
const destination = 'https://openhim.example.org/adapter/dhis2/patient' as Destination
const createdAt = new Date('2024-01-01') as CreatedAt
const activatedAt = new Date('2024-01-02') as ActivatedAt
const deactivatedAt = new Date('2024-01-03') as DeactivatedAt

const oldPipeline: Pipeline = [
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

const newPipeline: Pipeline = [
  {
    type: 'filter',
    rules: {
      logic: 'or',
      conditions: [
        { field: 'type' as FieldPath, operator: 'equals', value: 'patient-created' },
        { field: 'type' as FieldPath, operator: 'equals', value: 'patient-updated' },
      ],
    },
  },
]

const draftMediation: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  destination,
  pipeline: oldPipeline,
  createdAt,
}

const deactivatedMediation: DeactivatedMediation = {
  status: 'deactivated',
  id: mediationId,
  topic,
  destination,
  pipeline: oldPipeline,
  createdAt,
  activatedAt,
  deactivatedAt,
}

const expectedDraft: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  destination,
  pipeline: newPipeline,
  createdAt,
}

const expectedDeactivated: DeactivatedMediation = {
  status: 'deactivated',
  id: mediationId,
  topic,
  destination,
  pipeline: newPipeline,
  createdAt,
  activatedAt,
  deactivatedAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const applyPipelineSpec: FunctionSpec<
  ApplyPipelineInput, DraftMediation | DeactivatedMediation, ApplyPipelineFailure, ApplyPipelineSuccess
> = {
  constraints: {},
  successes: {
    'pipeline-applied': {
      condition: () => true,
      assertions: {
        'status-preserved': ({ input, output }) => output.status === input.state.status,
        'id-preserved': ({ input, output }) => output.id === input.state.id,
        'topic-preserved': ({ input, output }) => output.topic === input.state.topic,
        'destination-preserved': ({ input, output }) => output.destination === input.state.destination,
        'pipeline-replaced': ({ input, output }) => output.pipeline === input.pipeline,
        'created-at-preserved': ({ input, output }) => output.createdAt === input.state.createdAt,
      },
      examples: [
        { when: { state: draftMediation, pipeline: newPipeline }, then: expectedDraft },
        { when: { state: deactivatedMediation, pipeline: newPipeline }, then: expectedDeactivated },
      ],
    },
  },
}
