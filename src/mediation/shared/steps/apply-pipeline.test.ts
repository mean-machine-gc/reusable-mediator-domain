// apply-pipeline.test.ts
import { runSpec } from '../../../shared/testing'
import { applyPipeline } from './apply-pipeline'
import { applyPipelineSpec } from './apply-pipeline.spec'

describe('applyPipeline', () => {
  runSpec(applyPipeline, applyPipelineSpec)
})
