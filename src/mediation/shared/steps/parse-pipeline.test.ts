// parse-pipeline.test.ts
import { runSpec } from '../../../shared/testing'
import { parsePipeline } from './parse-pipeline'
import { parsePipelineSpec } from './parse-pipeline.spec'

describe('parsePipeline', () => {
  runSpec(parsePipeline, parsePipelineSpec)
})
