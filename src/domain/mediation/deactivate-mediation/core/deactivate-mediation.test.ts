import { testSpec } from '../../../shared/spec-framework'
import { deactivateMediationCoreSpec } from './deactivate-mediation.spec'
import { deactivateMediationCore } from './deactivate-mediation'

testSpec('deactivateMediationCore', deactivateMediationCoreSpec, deactivateMediationCore)
