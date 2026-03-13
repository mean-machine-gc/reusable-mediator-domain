import { testSpec } from '../../shared/spec-framework'
import { createDispatchShellSpec, testDeps } from './create-dispatch.spec'
import { _createDispatch } from './create-dispatch'

testSpec('createDispatchShell', createDispatchShellSpec, _createDispatch(testDeps))
