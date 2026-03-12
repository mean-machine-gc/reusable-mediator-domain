import { testSpec } from '../../../shared/spec-framework'
import { evaluateFilterStepSpec } from './evaluate-filter-step.spec'
import { evaluateFilterStep } from './evaluate-filter-step'

testSpec('evaluateFilterStep', evaluateFilterStepSpec, evaluateFilterStep)
