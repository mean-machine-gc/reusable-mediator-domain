// update-pipeline core spec
import type { FactorySpec } from '../../../shared/spec'
import type {
  Mediation, DraftMediation, ActiveMediation, DeactivatedMediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../../types'
import { checkUpdatableStateSpec } from '../../shared/steps/check-updatable-state.spec'
import { applyPipelineSpec } from '../../shared/steps/apply-pipeline.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type CoreInput = {
  cmd: { pipeline: Pipeline }
  state: Mediation
}

type CoreOutput = DraftMediation | DeactivatedMediation
type CoreFailure = 'not_draft_or_deactivated'
type CoreSuccess = 'pipeline-updated'

export type { CoreInput, CoreOutput, CoreFailure, CoreSuccess }

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

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  destination,
  pipeline: oldPipeline,
  createdAt,
  activatedAt,
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
export const updatePipelineCoreSpec: FactorySpec<
  CoreInput, CoreOutput, CoreFailure, CoreSuccess
> = {
  steps: {
    checkUpdatableState: checkUpdatableStateSpec,
    applyPipeline: applyPipelineSpec,
  },
  failures: {
    not_draft_or_deactivated: [
      { when: { cmd: { pipeline: newPipeline }, state: activeMediation } },
    ],
  },
  successes: {
    'pipeline-updated': {
      condition: () => true,
      examples: [
        { when: { cmd: { pipeline: newPipeline }, state: draftMediation }, then: expectedDraft },
        { when: { cmd: { pipeline: newPipeline }, state: deactivatedMediation }, then: expectedDeactivated },
      ],
    },
  },
}
