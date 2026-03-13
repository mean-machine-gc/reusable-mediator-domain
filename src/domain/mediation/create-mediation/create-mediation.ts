import type { CreateMediationShellFn } from './create-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { assembleDraftMediation } from '../shared/steps/assemble-draft-mediation'
import { _safeGenerateId } from '../../shared/safe-generate-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGenerateId: typeof _safeGenerateId
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    assembleDraftMediation: typeof assembleDraftMediation
}

type Deps = {
    generateId: DomainDeps['generateId']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

const createMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): CreateMediationShellFn['asyncSignature'] => {
    const generateId = steps.safeGenerateId(deps.generateId)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const idResult = await generateId()
        if (!idResult.ok) return idResult as any
        const id = idResult.value

        const createdAtResult = await generateTimestamp()
        if (!createdAtResult.ok) return createdAtResult as any

        const draft = steps.assembleDraftMediation({
            cmd: { topic: input.cmd.topic, destination: input.cmd.destination, pipeline: input.cmd.pipeline },
            ctx: { id, createdAt: createdAtResult.value },
        })
        if (!draft.ok) return draft as any

        await deps.upsertMediation(draft.value)

        return { ok: true, value: draft.value, successType: ['mediation-created'] }
    }
    }

export const _createMediation = createMediationShellFactory({
    safeGenerateId: _safeGenerateId,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    assembleDraftMediation,
})
