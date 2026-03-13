import { testSpec } from '../shared/spec-framework'
import { parseDispatchSpec } from './parse-dispatch.spec'
import { parseDispatch } from './parse-dispatch'

testSpec('parseDispatch', parseDispatchSpec, parseDispatch)
