import { testSpec } from '../../../shared/spec-framework'
import { assembleDeactivatedMediationSpec } from './assemble-deactivated-mediation.spec'
import { assembleDeactivatedMediation } from './assemble-deactivated-mediation'

testSpec('assembleDeactivatedMediation', assembleDeactivatedMediationSpec, assembleDeactivatedMediation)
