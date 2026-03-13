import { testSpec } from '../../shared/spec-framework'
import { activateMediationShellSpec, testDeps } from './activate-mediation.spec'
import { _activateMediation } from './activate-mediation'

testSpec('activateMediationShell', activateMediationShellSpec, _activateMediation(testDeps))
