import type { SpecFn, Spec, StepInfo, AnyFn } from '../../shared/spec-framework'
import type { ActiveMediation, MediationIdFailure } from '../types'
import { parseMediationIdSpec } from '../shared/steps/parse-mediation-id.spec'
import { activateMediationCoreSpec } from './core/activate-mediation.spec'

type ShellInput = { cmd: { mediationId: unknown } }

export type ActivateMediationShellFn = SpecFn<
    ShellInput,
    ActiveMediation,
    MediationIdFailure | 'already_active',
    'draft-activated' | 'reactivated'
>

const steps: StepInfo[] = [
    { name: 'parseMediationId', type: 'step', description: 'Parse and validate the mediation ID', spec: parseMediationIdSpec as unknown as Spec<AnyFn> },
    { name: 'findMediation', type: 'dep', description: 'Fetch mediation from persistence' },
    { name: 'generateTimestamp', type: 'dep', description: 'Generate activation timestamp' },
    { name: 'activateMediationCore', type: 'step', description: 'Run activation core logic', spec: activateMediationCoreSpec as unknown as Spec<AnyFn> },
    { name: 'saveMediation', type: 'dep', description: 'Persist the activated mediation' },
]

export const activateMediationShellSpec: Spec<ActivateMediationShellFn> = {
    steps,
    shouldFailWith: {},
    shouldSucceedWith: {
        'draft-activated': {
            description: 'A draft mediation becomes active',
            examples: [],
        },
        'reactivated': {
            description: 'A deactivated mediation becomes active again',
            examples: [],
        },
    },
    shouldAssert: {
        'draft-activated': {},
        'reactivated': {},
    },
}
