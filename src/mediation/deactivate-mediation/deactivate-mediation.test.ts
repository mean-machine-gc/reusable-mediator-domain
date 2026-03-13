import { testSpec } from '../../shared/spec-framework'
import { deactivateMediationShellSpec, testDeps } from './deactivate-mediation.spec'
import { _deactivateMediation } from './deactivate-mediation'

testSpec('deactivateMediationShell', deactivateMediationShellSpec, _deactivateMediation(testDeps))
