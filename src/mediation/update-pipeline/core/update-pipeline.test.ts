// update-pipeline core test
import { runFactorySpec } from '../../../shared/testing'
import { updatePipelineCoreFactory, coreSteps } from './update-pipeline'
import { updatePipelineCoreSpec } from './update-pipeline.spec'

const updatePipelineCore = updatePipelineCoreFactory(coreSteps)

describe('updatePipelineCore', () => {
  runFactorySpec(updatePipelineCore, updatePipelineCoreSpec)
})
