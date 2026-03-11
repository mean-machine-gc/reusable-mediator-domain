// delete-mediation core test
import { runFactorySpec } from '../../../shared/testing'
import { deleteMediationCoreFactory, coreSteps } from './delete-mediation'
import { deleteMediationCoreSpec } from './delete-mediation.spec'

const deleteMediationCore = deleteMediationCoreFactory(coreSteps)

describe('deleteMediationCore', () => {
  runFactorySpec(deleteMediationCore, deleteMediationCoreSpec)
})
