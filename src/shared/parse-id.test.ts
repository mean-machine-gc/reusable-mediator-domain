import { testSpec } from './spec-framework'
import { parseIdSpec } from './parse-id.spec'
import { parseId } from './primitives'

const parseIdFixed = (raw: unknown) => parseId(raw, 'id-parsed')

testSpec('parseId', parseIdSpec, parseIdFixed)
