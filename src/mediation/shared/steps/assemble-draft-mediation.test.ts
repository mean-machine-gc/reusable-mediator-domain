// assemble-draft-mediation.test.ts
import { runSpec } from '../../../shared/testing'
import { assembleDraftMediation } from './assemble-draft-mediation'
import { assembleDraftMediationSpec } from './assemble-draft-mediation.spec'

describe('assembleDraftMediation', () => {
  runSpec(assembleDraftMediation, assembleDraftMediationSpec)
})
