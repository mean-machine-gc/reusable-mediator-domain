// assemble-draft-mediation.ts
import type { Result } from '../../../shared/spec'
import type { DraftMediation, MediationId, Topic, Destination, Pipeline, CreatedAt } from '../../types'
import type { AssembleDraftMediationFailure, AssembleDraftMediationSuccess } from './assemble-draft-mediation.spec'

type AssembleDraftMediationInput = {
  cmd: { topic: Topic; destination: Destination; pipeline: Pipeline }
  ctx: { id: MediationId; createdAt: CreatedAt }
}

export const assembleDraftMediation = (input: AssembleDraftMediationInput): Result<DraftMediation, AssembleDraftMediationFailure, AssembleDraftMediationSuccess> => {
  return {
    ok: true,
    value: {
      status: 'draft',
      id: input.ctx.id,
      topic: input.cmd.topic,
      schema: {},
      destination: input.cmd.destination,
      pipeline: input.cmd.pipeline,
      createdAt: input.ctx.createdAt,
    },
    successType: ['draft-mediation-assembled'],
  }
}
