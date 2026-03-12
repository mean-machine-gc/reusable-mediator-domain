import { testSpec } from '../../../shared/spec-framework'
import { parseMediationIdSpec } from './parse-mediation-id.spec'
import { parseMediationId } from './parse-mediation-id'

testSpec('parseMediationId', parseMediationIdSpec, parseMediationId)
