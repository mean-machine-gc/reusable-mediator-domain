// check-updatable-state.test.ts
import { runSpec } from '../../../shared/testing'
import { checkUpdatableState } from './check-updatable-state'
import { checkUpdatableStateSpec } from './check-updatable-state.spec'

describe('checkUpdatableState', () => {
  runSpec(checkUpdatableState, checkUpdatableStateSpec)
})
