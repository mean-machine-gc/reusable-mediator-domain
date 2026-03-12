import { testSpec } from '../../../shared/spec-framework'
import { assembleActiveMediationSpec } from './assemble-active-mediation.spec'
import { assembleActiveMediation } from './assemble-active-mediation'

testSpec('assembleActiveMediation', assembleActiveMediationSpec, assembleActiveMediation)
