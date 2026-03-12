import { testSpec } from '../../../shared/spec-framework'
import { mediateProcessingSpec } from './mediate-processing.spec'
import { mediateProcessing } from './mediate-processing'

testSpec('mediateProcessing', mediateProcessingSpec, mediateProcessing)
