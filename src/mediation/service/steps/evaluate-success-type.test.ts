import { testSpec } from '../../../shared/spec-framework'
import { evaluateServiceSuccessTypeSpec } from './evaluate-success-type.spec'
import { evaluateServiceSuccessType } from './evaluate-success-type'

testSpec('evaluateServiceSuccessType', evaluateServiceSuccessTypeSpec, evaluateServiceSuccessType)
