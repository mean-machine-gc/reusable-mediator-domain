import { testSpec } from '../../../shared/spec-framework'
import { parseAttemptedAtSpec } from './parse-attempted-at.spec'
import { parseAttemptedAt } from './parse-attempted-at'

testSpec('parseAttemptedAt', parseAttemptedAtSpec, parseAttemptedAt)
