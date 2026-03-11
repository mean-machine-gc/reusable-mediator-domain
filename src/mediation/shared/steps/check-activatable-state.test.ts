// check-activatable-state.test.ts
import { runSpec } from '../../../shared/testing'
import { checkActivatableState } from './check-activatable-state'
import { checkActivatableStateSpec } from './check-activatable-state.spec'

describe('checkActivatableState', () => {
  runSpec(checkActivatableState, checkActivatableStateSpec)
})
