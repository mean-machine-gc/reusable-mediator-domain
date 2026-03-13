import { testSpec } from '../../../shared/spec-framework'
import { activateMediationCoreSpec } from './activate-mediation.spec'
import { activateMediationCore } from './activate-mediation'

testSpec('activateMediationCore', activateMediationCoreSpec, activateMediationCore)
