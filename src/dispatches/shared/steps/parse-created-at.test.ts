import { testSpec } from '../../../shared/spec-framework'
import { parseCreatedAtSpec } from './parse-created-at.spec'
import { parseCreatedAt } from './parse-created-at'

testSpec('parseCreatedAt', parseCreatedAtSpec, parseCreatedAt)
