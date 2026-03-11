// create-mediation.spec.ts
import type { ShellFactorySpec, Result } from '../../shared/spec'
import type {
  DraftMediation, MediationId, Topic, Destination,
  Pipeline, CreatedAt, FieldPath,
} from '../types'
import { parseTopicSpec } from '../shared/steps/parse-topic.spec'
import { parseDestinationSpec } from '../shared/steps/parse-destination.spec'
import { parsePipelineSpec } from '../shared/steps/parse-pipeline.spec'
import { assembleDraftMediationSpec } from '../shared/steps/assemble-draft-mediation.spec'

// ── Types ──────────────────────────────────────────────────────────────────
type CreateMediationCommand = {
  topic: unknown
  destination: unknown
  pipeline: unknown
}

type ShellInput = { cmd: CreateMediationCommand }
type ShellOutput = DraftMediation

type ShellFailure =
  | 'not_a_string' | 'empty' | 'too_short_min_2' | 'too_long_max_256'
  | 'invalid_format_dot_separated_segments' | 'invalid_chars_alphanumeric_hyphens_and_dots_only'
  | 'too_long_max_2048' | 'invalid_format_url'
  | 'not_an_array' | 'invalid_step'
  | 'script_injection'

type ShellSuccess = 'mediation-created'

type Deps = {
  generateId: () => Promise<Result<MediationId>>
  generateTimestamp: () => Promise<Result<CreatedAt>>
  saveMediation: (mediation: DraftMediation) => Promise<Result<DraftMediation>>
}

export type { CreateMediationCommand, ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps }

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

const validCmd: CreateMediationCommand = {
  topic: 'orders.order-created.v1',
  destination: 'https://openhim.example.org/adapter/dhis2/patient',
  pipeline,
}

const validInput: ShellInput = { cmd: validCmd }

const expectedDraft: DraftMediation = {
  status: 'draft',
  id: mediationId,
  topic,
  destination,
  pipeline,
  createdAt,
}

// ── Spec ───────────────────────────────────────────────────────────────────
export const createMediationShellSpec: ShellFactorySpec<
  ShellInput, ShellOutput, ShellFailure, ShellSuccess, Deps
> = {
  steps: {
    parseTopic: parseTopicSpec,
    parseDestination: parseDestinationSpec,
    parsePipeline: parsePipelineSpec,
    assembleDraftMediation: assembleDraftMediationSpec,
  },
  deps: {
    generateId: { failures: ['generate_id_failed'] },
    generateTimestamp: { failures: ['generate_timestamp_failed'] },
    saveMediation: { failures: ['save_failed'] },
  },
  failures: {
    // parseTopic failures
    not_a_string: [{ when: { cmd: { ...validCmd, topic: 42 } } }],
    empty: [{ when: { cmd: { ...validCmd, topic: '' } } }],
    too_short_min_2: [{ when: { cmd: { ...validCmd, topic: 'a' } } }],
    too_long_max_256: [{ when: { cmd: { ...validCmd, topic: 'a'.repeat(257) } } }],
    invalid_format_dot_separated_segments: [{ when: { cmd: { ...validCmd, topic: '.orders' } } }],
    invalid_chars_alphanumeric_hyphens_and_dots_only: [{ when: { cmd: { ...validCmd, topic: 'orders/created' } } }],
    // parseDestination failures
    too_long_max_2048: [{ when: { cmd: { ...validCmd, destination: 'https://example.com/' + 'a'.repeat(2040) } } }],
    invalid_format_url: [{ when: { cmd: { ...validCmd, destination: 'not-a-url' } } }],
    // parsePipeline failures
    not_an_array: [{ when: { cmd: { ...validCmd, pipeline: 'not-an-array' } } }],
    invalid_step: [{ when: { cmd: { ...validCmd, pipeline: [{ type: 'unknown', rules: {} }] } } }],
    // security
    script_injection: [{ when: { cmd: { ...validCmd, topic: '<script>alert(1)</script>' } } }],
  },
  successes: {
    'mediation-created': {
      condition: () => true,
      examples: [
        { when: validInput, then: expectedDraft },
      ],
    },
  },
  baseDeps: {
    generateId: async () => ({ ok: true as const, value: mediationId, successType: ['id-generated'] }),
    generateTimestamp: async () => ({ ok: true as const, value: createdAt, successType: ['timestamp-generated'] }),
    saveMediation: async (mediation) => ({ ok: true as const, value: mediation, successType: ['mediation-saved'] }),
  },
  depPropagation: {
    generateId: { when: validInput, failsWith: 'generate_id_failed' },
    generateTimestamp: { when: validInput, failsWith: 'generate_timestamp_failed' },
    saveMediation: { when: validInput, failsWith: 'save_failed' },
  },
}
