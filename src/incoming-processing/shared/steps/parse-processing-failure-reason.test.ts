import { testSpec } from '../../../shared/spec-framework'
import { parseProcessingFailureReasonSpec } from './parse-processing-failure-reason.spec'
import { parseProcessingFailureReason } from './parse-processing-failure-reason'

testSpec('parseProcessingFailureReason', parseProcessingFailureReasonSpec, parseProcessingFailureReason)
