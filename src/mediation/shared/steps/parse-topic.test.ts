// parse-topic.test.ts
import { runSpec } from '../../../shared/testing'
import { parseTopic } from './parse-topic'
import { parseTopicSpec } from './parse-topic.spec'

describe('parseTopic', () => {
  runSpec(parseTopic, parseTopicSpec)
})
