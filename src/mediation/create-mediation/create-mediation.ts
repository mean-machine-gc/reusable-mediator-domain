import type { CreateMediationShellFn } from './create-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { assembleDraftMediation } from '../shared/steps/assemble-draft-mediation'

type ShellSteps = {
    assembleDraftMediation: typeof assembleDraftMediation
}

type Deps = {
    generateId: DomainDeps['generateId']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

const createMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): CreateMediationShellFn['asyncSignature'] =>
    async (input) => {
        const rawIdResult = await deps.generateId()
        const id = rawIdResult.value

        const createdAtResult = await deps.generateTimestamp()

        const draft = steps.assembleDraftMediation({
            cmd: { topic: input.cmd.topic, destination: input.cmd.destination, pipeline: input.cmd.pipeline },
            ctx: { id, createdAt: createdAtResult.value },
        })
        if (!draft.ok) return draft as any

        await deps.upsertMediation(draft.value)

        return { ok: true, value: draft.value, successType: ['mediation-created'] }
    }

export const _createMediation = createMediationShellFactory({
    assembleDraftMediation,
})
