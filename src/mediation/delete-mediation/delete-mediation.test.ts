// delete-mediation shell test
import { runShellSpec } from '../../shared/testing'
import { deleteMediationShellFactory, shellSteps } from './delete-mediation'
import { deleteMediationShellSpec } from './delete-mediation.spec'

const makeDeleteMediation = deleteMediationShellFactory(shellSteps)
const deleteMediation = makeDeleteMediation(deleteMediationShellSpec.baseDeps)

describe('deleteMediationShell', () => {
  runShellSpec(
    deleteMediation,
    makeDeleteMediation,
    deleteMediationShellSpec,
  )
})
