import { testSpec } from '../../../shared/spec-framework'
import { checkActivatableStateSpec } from './check-activatable-state.spec'
import { checkActivatableState } from './check-activatable-state'

testSpec('checkActivatableState', checkActivatableStateSpec, checkActivatableState)
