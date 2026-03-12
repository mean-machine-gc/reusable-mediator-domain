// assemble-active-mediation.ts
import type { Result } from '../../../shared/spec'
import type { ActiveMediation } from '../../types'
import type { AssembleActiveMediationFailure, AssembleActiveMediationSuccess, AssembleActiveMediationInput } from './assemble-active-mediation.spec'

export const assembleActiveMediation = (
  input: AssembleActiveMediationInput,
): Result<ActiveMediation, AssembleActiveMediationFailure, AssembleActiveMediationSuccess> => {
  const { state, ctx } = input
  return {
    ok: true,
    value: {
      status: 'active',
      id: state.id,
      topic: state.topic,
      schema: state.schema,
      destination: state.destination,
      pipeline: state.pipeline,
      createdAt: state.createdAt,
      activatedAt: ctx.activatedAt,
    },
    successType: ['active-mediation-assembled'],
  }
}
