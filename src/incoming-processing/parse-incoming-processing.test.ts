import { testSpec } from '../shared/spec-framework'
import { parseIncomingProcessingSpec } from './parse-incoming-processing.spec'
import { parseIncomingProcessing } from './parse-incoming-processing'

testSpec('parseIncomingProcessing', parseIncomingProcessingSpec, parseIncomingProcessing)
