import { testSpec } from '../../../shared/spec-framework'
import { parseValidatedAtSpec } from './parse-validated-at.spec'
import { parseValidatedAt } from './parse-validated-at'

testSpec('parseValidatedAt', parseValidatedAtSpec, parseValidatedAt)
