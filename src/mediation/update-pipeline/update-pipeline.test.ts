// update-pipeline shell test
import { runShellSpec } from '../../shared/testing'
import { updatePipelineShellFactory, shellSteps } from './update-pipeline'
import { updatePipelineShellSpec } from './update-pipeline.spec'

const makeUpdatePipeline = updatePipelineShellFactory(shellSteps)
const updatePipeline = makeUpdatePipeline(updatePipelineShellSpec.baseDeps)

describe('updatePipelineShell', () => {
  runShellSpec(
    updatePipeline,
    makeUpdatePipeline,
    updatePipelineShellSpec,
  )
})
