import { testSpec } from '../../../shared/spec-framework'
import { evaluateConditionHandlerSpecs } from './evaluate-condition.spec'
import { evaluateCondition } from './evaluate-condition'

for (const [operator, spec] of Object.entries(evaluateConditionHandlerSpecs)) {
    testSpec(`evaluateCondition.${operator}`, spec, evaluateCondition[operator as keyof typeof evaluateCondition])
}
