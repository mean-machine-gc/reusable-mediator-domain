import { testSpec } from '../../../shared/spec-framework'
import { parsePipelineSpec } from './parse-pipeline.spec'
import { parsePipeline } from './parse-pipeline'

testSpec('parsePipeline', parsePipelineSpec, parsePipeline)
