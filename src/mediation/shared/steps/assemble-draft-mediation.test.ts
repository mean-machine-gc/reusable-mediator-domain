import { testSpec } from '../../../shared/spec-framework'
import { assembleDraftMediationSpec } from './assemble-draft-mediation.spec'
import { assembleDraftMediation } from './assemble-draft-mediation'

testSpec('assembleDraftMediation', assembleDraftMediationSpec, assembleDraftMediation)
