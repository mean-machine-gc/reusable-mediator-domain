import { testSpec } from '../../../shared/spec-framework'
import { parseDispatchIdSpec } from './parse-dispatch-id.spec'
import { parseDispatchId } from './parse-dispatch-id'

testSpec('parseDispatchId', parseDispatchIdSpec, parseDispatchId)
