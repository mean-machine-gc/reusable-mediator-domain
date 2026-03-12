import { testSpec } from '../../../shared/spec-framework'
import { parseProcessingIdSpec } from './parse-processing-id.spec'
import { parseProcessingId } from './parse-processing-id'

testSpec('parseProcessingId', parseProcessingIdSpec, parseProcessingId)
