import { testSpec } from '../../../shared/spec-framework'
import { parseResponseBodySpec } from './parse-response-body.spec'
import { parseResponseBody } from './parse-response-body'

testSpec('parseResponseBody', parseResponseBodySpec, parseResponseBody)
