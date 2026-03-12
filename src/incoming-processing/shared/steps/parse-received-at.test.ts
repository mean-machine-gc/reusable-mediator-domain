import { testSpec } from '../../../shared/spec-framework'
import { parseReceivedAtSpec } from './parse-received-at.spec'
import { parseReceivedAt } from './parse-received-at'

testSpec('parseReceivedAt', parseReceivedAtSpec, parseReceivedAt)
