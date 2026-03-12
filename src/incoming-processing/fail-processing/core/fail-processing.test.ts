import { testSpec } from '../../../shared/spec-framework'
import { failProcessingSpec } from './fail-processing.spec'
import { failProcessing } from './fail-processing'

testSpec('failProcessing', failProcessingSpec, failProcessing)
