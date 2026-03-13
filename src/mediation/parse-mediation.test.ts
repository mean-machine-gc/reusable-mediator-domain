import { testSpec } from '../shared/spec-framework'
import { parseMediationSpec } from './parse-mediation.spec'
import { parseMediation } from './parse-mediation'

testSpec('parseMediation', parseMediationSpec, parseMediation)
