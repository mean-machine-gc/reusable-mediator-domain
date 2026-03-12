// assemble-deactivated-mediation.ts
import type { Result } from '../../../shared/spec'
import type { DeactivatedMediation } from '../../types'
import type { AssembleDeactivatedMediationFailure, AssembleDeactivatedMediationSuccess, AssembleDeactivatedMediationInput } from './assemble-deactivated-mediation.spec'

export const assembleDeactivatedMediation = (
  input: AssembleDeactivatedMediationInput,
): Result<DeactivatedMediation, AssembleDeactivatedMediationFailure, AssembleDeactivatedMediationSuccess> => {
  const { state, ctx } = input
  return {
    ok: true,
    value: {
      status: 'deactivated',
      id: state.id,
      topic: state.topic,
      schema: state.schema,
      destination: state.destination,
      pipeline: state.pipeline,
      createdAt: state.createdAt,
      activatedAt: state.activatedAt,
      deactivatedAt: ctx.deactivatedAt,
    },
    successType: ['deactivated-mediation-assembled'],
  }
}
