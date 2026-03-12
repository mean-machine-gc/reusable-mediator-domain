import { testSpec } from '../../../shared/spec-framework'
import { classifyValidationResultsSpec } from './classify-validation-results.spec'
import { classifyValidationResults } from './classify-validation-results'

testSpec('classifyValidationResults', classifyValidationResultsSpec, classifyValidationResults)
