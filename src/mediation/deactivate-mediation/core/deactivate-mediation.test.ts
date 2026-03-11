// deactivate-mediation core test
import { runFactorySpec } from '../../../shared/testing'
import { deactivateMediationCoreFactory, coreSteps } from './deactivate-mediation'
import { deactivateMediationCoreSpec } from './deactivate-mediation.spec'

const deactivateMediationCore = deactivateMediationCoreFactory(coreSteps)

describe('deactivateMediationCore', () => {
  runFactorySpec(deactivateMediationCore, deactivateMediationCoreSpec)
})
