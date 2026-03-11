// deactivate-mediation shell test
import { runShellSpec } from '../../shared/testing'
import { deactivateMediationShellFactory, shellSteps } from './deactivate-mediation'
import { deactivateMediationShellSpec } from './deactivate-mediation.spec'

const makeDeactivateMediation = deactivateMediationShellFactory(shellSteps)
const deactivateMediation = makeDeactivateMediation(deactivateMediationShellSpec.baseDeps)

describe('deactivateMediationShell', () => {
  runShellSpec(
    deactivateMediation,
    makeDeactivateMediation,
    deactivateMediationShellSpec,
  )
})
