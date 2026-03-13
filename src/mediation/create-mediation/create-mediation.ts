import type { CreateMediationShellFn } from './create-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ParseMediationIdFn } from '../shared/steps/parse-mediation-id.spec'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { parseTopic } from '../shared/steps/parse-topic'
import { parseDestination } from '../shared/steps/parse-destination'
import { parsePipeline } from '../shared/steps/parse-pipeline'
import { assembleDraftMediation } from '../shared/steps/assemble-draft-mediation'

type ShellSteps = {
    parseMediationId: ParseMediationIdFn['signature']
    parseTopic: typeof parseTopic
    parseDestination: typeof parseDestination
    parsePipeline: typeof parsePipeline
    assembleDraftMediation: typeof assembleDraftMediation
}

type Deps = {
    generateId: DomainDeps['generateId']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

export const shellSteps: ShellSteps = {
    parseMediationId,
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

        const rawIdResult = await deps.generateId()
        const id = steps.parseMediationId(rawIdResult.value)
        if (!id.ok) return id as any

        const createdAtResult = await deps.generateTimestamp()

        const draft = steps.assembleDraftMediation({
            cmd: { topic: topic.value, destination: destination.value, pipeline: pipeline.value },
            ctx: { id: id.value, createdAt: createdAtResult.value },
        })
        if (!draft.ok) return draft as any

        await deps.upsertMediation(draft.value)

        return { ok: true, value: draft.value, successType: ['mediation-created'] }
    }

export const _createMediation = createMediationShellFactory(shellSteps)
