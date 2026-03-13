import { testSpec } from './spec-framework'
import { parseTimestampSpec } from './parse-timestamp.spec'
import { parseTimestamp } from './primitives'

const parseTimestampFixed = (raw: unknown) => parseTimestamp(raw, 'timestamp-parsed')

testSpec('parseTimestamp', parseTimestampSpec, parseTimestampFixed)
