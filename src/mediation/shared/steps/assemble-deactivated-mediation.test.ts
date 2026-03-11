// assemble-deactivated-mediation.test.ts
import { runSpec } from '../../../shared/testing'
import { assembleDeactivatedMediation } from './assemble-deactivated-mediation'
import { assembleDeactivatedMediationSpec } from './assemble-deactivated-mediation.spec'

describe('assembleDeactivatedMediation', () => {
  runSpec(assembleDeactivatedMediation, assembleDeactivatedMediationSpec)
})
