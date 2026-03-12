import { testSpec } from '../../../shared/spec-framework'
import { evaluateMediateOutcomeSpec } from './evaluate-mediate-outcome.spec'
import { evaluateMediateOutcome } from './evaluate-mediate-outcome'

testSpec('evaluateMediateOutcome', evaluateMediateOutcomeSpec, evaluateMediateOutcome)
