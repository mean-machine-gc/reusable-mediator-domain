import { testSpec } from '../../../shared/spec-framework'
import { parseFailedAtSpec } from './parse-failed-at.spec'
import { parseFailedAt } from './parse-failed-at'

testSpec('parseFailedAt', parseFailedAtSpec, parseFailedAt)
