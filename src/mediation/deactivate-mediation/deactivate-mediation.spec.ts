import type { SpecFn, Spec, StepInfo } from '../../shared/spec-framework'
import { asStepSpec } from '../../shared/spec-framework'
import type { DeactivatedMediation, MediationIdValidations } from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { deactivateMediationCoreSpec } from './core/deactivate-mediation.spec'

type ShellInput = { cmd: { mediationId: unknown } }

export type DeactivateMediationShellFn = SpecFn<
    ShellInput,
    DeactivatedMediation,
    MediationIdValidations | 'not_active',
    'mediation-deactivated'
>

const steps: StepInfo[] = [
    { name: 'parseMediationId', type: 'step', description: 'Parse and validate the mediation ID', spec: asStepSpec(parseMediationIdSpec) },
    { name: 'getMediationById', type: 'dep', description: 'Fetch mediation from persistence' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate deactivation timestamp' },
    { name: 'deactivateMediationCore', type: 'step', description: 'Run deactivation core logic', spec: asStepSpec(deactivateMediationCoreSpec) },
    { name: 'upsertMediation', type: 'dep', description: 'Persist the deactivated mediation' },
]

export const deactivateMediationShellSpec: Spec<DeactivateMediationShellFn> = {
    document: true,
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'mediation-deactivated': {
            description: 'An active mediation becomes deactivated',
            examples: [],
        },
    },
    shouldAssert: {
        'mediation-deactivated': {},
    },
}
