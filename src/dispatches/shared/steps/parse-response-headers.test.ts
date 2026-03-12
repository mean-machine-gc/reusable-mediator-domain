import { testSpec } from '../../../shared/spec-framework'
import { parseResponseHeadersSpec } from './parse-response-headers.spec'
import { parseResponseHeaders } from './parse-response-headers'

testSpec('parseResponseHeaders', parseResponseHeadersSpec, parseResponseHeaders)
