// check-deletable-state.test.ts
import { runSpec } from '../../../shared/testing'
import { checkDeletableState } from './check-deletable-state'
import { checkDeletableStateSpec } from './check-deletable-state.spec'

describe('checkDeletableState', () => {
  runSpec(checkDeletableState, checkDeletableStateSpec)
})
