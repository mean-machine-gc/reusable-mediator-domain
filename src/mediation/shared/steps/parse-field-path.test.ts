// parse-field-path.test.ts
import { runSpec } from '../../../shared/testing'
import { parseFieldPath } from './parse-field-path'
import { parseFieldPathSpec } from './parse-field-path.spec'

describe('parseFieldPath', () => {
  runSpec(parseFieldPath, parseFieldPathSpec)
})
