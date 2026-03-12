// update-pipeline.spec.ts
import type { ShellFactorySpec, Result } from '../../shared/spec'
import type {
  DraftMediation, DeactivatedMediation, ActiveMediation, Mediation,
  MediationId, Topic, Destination, Pipeline, FieldPath,
  CreatedAt, ActivatedAt, DeactivatedAt,
} from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { parsePipelineSpec } from '../shared/steps/parse-pipeline.spec'
import { updatePipelineCoreSpec } from './core/update-pipeline.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type UpdatePipelineCommand = { mediationId: unknown; pipeline: unknown }

type ShellInput = { cmd: UpdatePipelineCommand }
type ShellOutput = DraftMediation | DeactivatedMediation

type ShellFailure =
  | 'not_a_string' | 'empty' | 'too_long_max_64' | 'not_a_uuid' | 'script_injection'
  | 'not_an_array' | 'invalid_step'
  | 'not_draft_or_deactivated'

type ShellSuccess = 'pipeline-updated'

type Deps = {
  findMediation: (id: MediationId) => Promise<Result<Mediation>>
  saveMediation: (mediation: DraftMediation | DeactivatedMediation) => Promise<Result<DraftMediation | DeactivatedMediation>>
}

export type { UpdatePipelineCommand, ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps }

// ── Test data ──────────────────────────────────────────────────────────────
const mediationId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as MediationId
const topic = 'orders.order-created.v1' as Topic
const destination = 'https://openhim.example.org/adapter/dhis2/patient' as Destination
const createdAt = new Date('2024-01-01') as CreatedAt

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
  schema: {},
  destination,
  pipeline: oldPipeline,
  createdAt,
}

const activeMediation: ActiveMediation = {
  status: 'active',
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline: oldPipeline,
  createdAt,
  activatedAt: new Date('2024-01-02') as ActivatedAt,
}

const validCmd: UpdatePipelineCommand = { mediationId, pipeline: newPipeline }
const validInput: ShellInput = { cmd: validCmd }

const expectedDraft: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  schema: {},
  destination,
  pipeline: newPipeline,
  createdAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const updatePipelineShellSpec: ShellFactorySpec<
  ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps
> = {
  steps: {
    parseMediationId: parseMediationIdSpec,
    parsePipeline: parsePipelineSpec,
    updatePipelineCore: updatePipelineCoreSpec,
  },
  deps: {
    findMediation: { failures: ['find_failed'] },
    saveMediation: { failures: ['save_failed'] },
  },
  failures: {
    // parseMediationId failures
    not_a_string: [{ when: { cmd: { ...validCmd, mediationId: 42 } } }],
    empty: [{ when: { cmd: { ...validCmd, mediationId: '' } } }],
    too_long_max_64: [{ when: { cmd: { ...validCmd, mediationId: 'a'.repeat(65) } } }],
    not_a_uuid: [{ when: { cmd: { ...validCmd, mediationId: 'not-a-uuid' } } }],
    script_injection: [{ when: { cmd: { ...validCmd, mediationId: '<script>alert(1)</script>' } } }],
    // parsePipeline failures
    not_an_array: [{ when: { cmd: { ...validCmd, pipeline: 'not-an-array' } } }],
    invalid_step: [{ when: { cmd: { ...validCmd, pipeline: [{ type: 'unknown', rules: {} }] } } }],
    // core failure
    not_draft_or_deactivated: [{ when: validInput }],
  },
  successes: {
    'pipeline-updated': {
      condition: () => true,
      examples: [
        { when: validInput, then: expectedDraft },
      ],
    },
  },
  baseDeps: {
    findMediation: async () => ({ ok: true as const, value: draftMediation, successType: ['mediation-found'] }),
    saveMediation: async (mediation) => ({ ok: true as const, value: mediation, successType: ['mediation-saved'] }),
  },
  baseDepsOverrides: {
    not_draft_or_deactivated: {
      findMediation: async () => ({ ok: true as const, value: activeMediation, successType: ['mediation-found'] }),
    },
  },
  depPropagation: {
    findMediation: { when: validInput, failsWith: 'find_failed' },
    saveMediation: { when: validInput, failsWith: 'save_failed' },
  },
}
