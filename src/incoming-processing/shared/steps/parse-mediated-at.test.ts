import { testSpec } from '../../../shared/spec-framework'
import { parseMediatedAtSpec } from './parse-mediated-at.spec'
import { parseMediatedAt } from './parse-mediated-at'

testSpec('parseMediatedAt', parseMediatedAtSpec, parseMediatedAt)
