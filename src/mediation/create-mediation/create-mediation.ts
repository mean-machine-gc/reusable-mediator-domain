import type { CreateMediationShellFn } from './create-mediation.spec'
import type { Result } from '../../shared/spec-framework'
import type { MediationId, CreatedAt, DraftMediation } from '../types'
import { parseTopic } from '../shared/steps/parse-topic'
import { parseDestination } from '../shared/steps/parse-destination'
import { parsePipeline } from '../shared/steps/parse-pipeline'
import { assembleDraftMediation } from '../shared/steps/assemble-draft-mediation'

type ShellSteps = {
    parseTopic: typeof parseTopic
    parseDestination: typeof parseDestination
    parsePipeline: typeof parsePipeline
    assembleDraftMediation: typeof assembleDraftMediation
}

type Deps = {
    generateId: () => Promise<Result<MediationId>>
    generateTimestamp: () => Promise<Result<CreatedAt>>
    saveMediation: (mediation: DraftMediation) => Promise<Result<DraftMediation>>
}

export const shellSteps: ShellSteps = {
    parseTopic,
    parseDestination,
    parsePipeline,
    assembleDraftMediation,
}

const createMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): CreateMediationShellFn['asyncSignature'] =>
    async (input) => {
        const topic = steps.parseTopic(input.cmd.topic)
        if (!topic.ok) return topic as any

        const destination = steps.parseDestination(input.cmd.destination)
        if (!destination.ok) return destination as any

        const pipeline = steps.parsePipeline(input.cmd.pipeline)
        if (!pipeline.ok) return pipeline as any

        const id = await deps.generateId()
        if (!id.ok) return id as any

        const timestamp = await deps.generateTimestamp()
        if (!timestamp.ok) return timestamp as any

        const draft = steps.assembleDraftMediation({
            cmd: { topic: topic.value, destination: destination.value, pipeline: pipeline.value },
            ctx: { id: id.value, createdAt: timestamp.value },
        })
        if (!draft.ok) return draft as any

        const saved = await deps.saveMediation(draft.value)
        if (!saved.ok) return saved as any

        return { ok: true, value: saved.value, successType: ['mediation-created'] }
    }

export const makeCreateMediation = createMediationShellFactory(shellSteps)
