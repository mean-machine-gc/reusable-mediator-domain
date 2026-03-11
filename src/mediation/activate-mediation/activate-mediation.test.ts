// activate-mediation shell test
import { runShellSpec } from '../../shared/testing'
import { activateMediationShellFactory, shellSteps } from './activate-mediation'
import { activateMediationShellSpec } from './activate-mediation.spec'

const makeActivateMediation = activateMediationShellFactory(shellSteps)
const activateMediation = makeActivateMediation(activateMediationShellSpec.baseDeps)

describe('activateMediationShell', () => {
  runShellSpec(
    activateMediation,
    makeActivateMediation,
    activateMediationShellSpec,
  )
})
