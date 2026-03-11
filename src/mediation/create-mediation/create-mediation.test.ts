// create-mediation.test.ts
import { runShellSpec } from '../../shared/testing'
import { createMediationShellFactory, shellSteps } from './create-mediation'
import { createMediationShellSpec } from './create-mediation.spec'

const makeCreateMediation = createMediationShellFactory(shellSteps)
const createMediation = makeCreateMediation(createMediationShellSpec.baseDeps)

describe('createMediationShell', () => {
  runShellSpec(
    createMediation,
    makeCreateMediation,
    createMediationShellSpec,
  )
})
