import { testSpec } from '../../../shared/spec-framework'
import { parseStatusCodeSpec } from './parse-status-code.spec'
import { parseStatusCode } from './parse-status-code'

testSpec('parseStatusCode', parseStatusCodeSpec, parseStatusCode)
