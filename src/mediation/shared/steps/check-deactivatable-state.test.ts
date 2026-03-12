import { testSpec } from '../../../shared/spec-framework'
import { checkDeactivatableStateSpec } from './check-deactivatable-state.spec'
import { checkDeactivatableState } from './check-deactivatable-state'

testSpec('checkDeactivatableState', checkDeactivatableStateSpec, checkDeactivatableState)
