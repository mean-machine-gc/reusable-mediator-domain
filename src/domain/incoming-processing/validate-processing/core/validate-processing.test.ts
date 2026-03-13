import { testSpec } from '../../../shared/spec-framework'
import { validateProcessingSpec } from './validate-processing.spec'
import { validateProcessing } from './validate-processing'

testSpec('validateProcessing', validateProcessingSpec, validateProcessing)
