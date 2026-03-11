// check-deactivatable-state.test.ts
import { runSpec } from '../../../shared/testing'
import { checkDeactivatableState } from './check-deactivatable-state'
import { checkDeactivatableStateSpec } from './check-deactivatable-state.spec'

describe('checkDeactivatableState', () => {
  runSpec(checkDeactivatableState, checkDeactivatableStateSpec)
})
