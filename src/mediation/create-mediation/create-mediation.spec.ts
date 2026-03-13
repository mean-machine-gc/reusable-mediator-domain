import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { DraftMediation, TopicValidations, DestinationValidations, PipelineValidations, MediationIdValidations } from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { parseTopicSpec } from '../shared/steps/parse-topic.spec'
import { parseDestinationSpec } from '../shared/steps/parse-destination.spec'
import { parsePipelineSpec } from '../shared/steps/parse-pipeline.spec'
import { assembleDraftMediationSpec } from '../shared/steps/assemble-draft-mediation.spec'

type ShellInput = { cmd: { topic: unknown; destination: unknown; pipeline: unknown } }

export type CreateMediationShellFn = SpecFn<
    ShellInput,
    DraftMediation,
    MediationIdValidations | TopicValidations | DestinationValidations | PipelineValidations,
    'mediation-created'
>

const steps: StepInfo[] = [
    { name: 'parseTopic', type: 'step', description: 'Parse and validate the topic', spec: asStepSpec(parseTopicSpec) },
    { name: 'parseDestination', type: 'step', description: 'Parse and validate the destination', spec: asStepSpec(parseDestinationSpec) },
    { name: 'parsePipeline', type: 'step', description: 'Parse and validate the pipeline', spec: asStepSpec(parsePipelineSpec) },
    { name: 'generateId', type: 'dep', description: 'Generate a unique mediation ID' },
    { name: 'parseMediationId', type: 'step', description: 'Parse and validate the generated mediation ID', spec: asStepSpec(parseMediationIdSpec) },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate creation timestamp' },
    { name: 'assembleDraftMediation', type: 'step', description: 'Assemble the draft mediation', spec: asStepSpec(assembleDraftMediationSpec) },
    { name: 'upsertMediation', type: 'dep', description: 'Persist the new mediation' },
]

export const createMediationShellSpec: Spec<CreateMediationShellFn> = {
    document: true,
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'mediation-created': {
            description: 'A new draft mediation is created',
            examples: [],
        },
    },
    shouldAssert: {
        'mediation-created': {},
    },
}
