import { testSpec } from '../../shared/spec-framework'
import { createMediationShellSpec, testDeps } from './create-mediation.spec'
import { _createMediation } from './create-mediation'

testSpec('createMediationShell', createMediationShellSpec, _createMediation(testDeps))
