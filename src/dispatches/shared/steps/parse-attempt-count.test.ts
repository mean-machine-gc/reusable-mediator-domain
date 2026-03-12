import { testSpec } from '../../../shared/spec-framework'
import { parseAttemptCountSpec } from './parse-attempt-count.spec'
import { parseAttemptCount } from './parse-attempt-count'

testSpec('parseAttemptCount', parseAttemptCountSpec, parseAttemptCount)
