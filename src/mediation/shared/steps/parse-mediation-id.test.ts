// parse-mediation-id.test.ts
import { runSpec } from '../../../shared/testing'
import { parseMediationId } from './parse-mediation-id'
import { parseMediationIdSpec } from './parse-mediation-id.spec'

describe('parseMediationId', () => {
  runSpec(parseMediationId, parseMediationIdSpec)
})
