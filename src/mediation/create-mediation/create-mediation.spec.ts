import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { DraftMediation, TopicFailure, DestinationFailure, PipelineFailure } from '../types'
import { parseTopicSpec } from '../shared/steps/parse-topic.spec'
import { parseDestinationSpec } from '../shared/steps/parse-destination.spec'
import { parsePipelineSpec } from '../shared/steps/parse-pipeline.spec'
import { assembleDraftMediationSpec } from '../shared/steps/assemble-draft-mediation.spec'

type ShellInput = { cmd: { topic: unknown; destination: unknown; pipeline: unknown } }

export type CreateMediationShellFn = SpecFn<
    ShellInput,
    DraftMediation,
    TopicFailure | DestinationFailure | PipelineFailure,
    'mediation-created'
>

const steps: StepInfo[] = [
    { name: 'parseTopic', type: 'step', description: 'Parse and validate the topic', spec: parseTopicSpec as unknown as Spec<AnyFn> },
    { name: 'parseDestination', type: 'step', description: 'Parse and validate the destination', spec: parseDestinationSpec as unknown as Spec<AnyFn> },
    { name: 'parsePipeline', type: 'step', description: 'Parse and validate the pipeline', spec: parsePipelineSpec as unknown as Spec<AnyFn> },
    { name: 'generateId', type: 'dep', description: 'Generate a unique mediation ID' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate creation timestamp' },
    { name: 'assembleDraftMediation', type: 'step', description: 'Assemble the draft mediation', spec: assembleDraftMediationSpec as unknown as Spec<AnyFn> },
    { name: 'saveMediation', type: 'dep', description: 'Persist the new mediation' },
]

export const createMediationShellSpec: Spec<CreateMediationShellFn> = {
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
