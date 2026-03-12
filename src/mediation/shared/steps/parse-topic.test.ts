import { testSpec } from '../../../shared/spec-framework'
import { parseTopicSpec } from './parse-topic.spec'
import { parseTopic } from './parse-topic'

testSpec('parseTopic', parseTopicSpec, parseTopic)
