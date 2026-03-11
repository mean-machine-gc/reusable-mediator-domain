// activate-mediation core test
import { runFactorySpec } from '../../../shared/testing'
import { activateMediationCoreFactory, coreSteps } from './activate-mediation'
import { activateMediationCoreSpec } from './activate-mediation.spec'

const activateMediationCore = activateMediationCoreFactory(coreSteps)

describe('activateMediationCore', () => {
  runFactorySpec(activateMediationCore, activateMediationCoreSpec)
})
