// evaluate-filter-step step factory
import type { EvaluateFilterStepFn } from './evaluate-filter-step.spec'
import type { EvaluateConditionStrategyFn } from './evaluate-condition.spec'
import { resolveField } from './resolve-field'
import { evaluateCondition } from './evaluate-condition'
import { composeResults } from './compose-results'

type Steps = {
    resolveField: typeof resolveField
    evaluateCondition: EvaluateConditionStrategyFn['handlers']
    composeResults: typeof composeResults
}

const evaluateFilterStepFactory =
    (steps: Steps): EvaluateFilterStepFn['signature'] =>
    (input) => {
        const results: boolean[] = []
        for (const condition of input.rules.conditions) {
            const fieldValue = steps.resolveField({ event: input.event, path: condition.field })
            if (!fieldValue.ok) return fieldValue as any

            const evaluation = steps.evaluateCondition[condition.operator]({ fieldValue: fieldValue.value, condition })
            if (!evaluation.ok) return evaluation as any

            results.push(evaluation.value)
        }

        const composed = steps.composeResults({ results, logic: input.rules.logic })
        if (!composed.ok) return composed as any

        const successType: 'filter-matched' | 'filter-rejected' = composed.value ? 'filter-matched' : 'filter-rejected'
        return { ok: true, value: composed.value, successType: [successType] }
    }

const filterSteps: Steps = { resolveField, evaluateCondition, composeResults }
export const evaluateFilterStep = evaluateFilterStepFactory(filterSteps)
