// parse-regex-pattern.test.ts
import { runSpec } from '../../../shared/testing'
import { parseRegexPattern } from './parse-regex-pattern'
import { parseRegexPatternSpec } from './parse-regex-pattern.spec'

describe('parseRegexPattern', () => {
  runSpec(parseRegexPattern, parseRegexPatternSpec)
})
