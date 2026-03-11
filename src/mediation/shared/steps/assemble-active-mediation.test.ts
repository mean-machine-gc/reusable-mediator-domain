// assemble-active-mediation.test.ts
import { runSpec } from '../../../shared/testing'
import { assembleActiveMediation } from './assemble-active-mediation'
import { assembleActiveMediationSpec } from './assemble-active-mediation.spec'

describe('assembleActiveMediation', () => {
  runSpec(assembleActiveMediation, assembleActiveMediationSpec)
})
