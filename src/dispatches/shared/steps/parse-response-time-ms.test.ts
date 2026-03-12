import { testSpec } from '../../../shared/spec-framework'
import { parseResponseTimeMsSpec } from './parse-response-time-ms.spec'
import { parseResponseTimeMs } from './parse-response-time-ms'

testSpec('parseResponseTimeMs', parseResponseTimeMsSpec, parseResponseTimeMs)
