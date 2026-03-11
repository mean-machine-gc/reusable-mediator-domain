// parse-destination.test.ts
import { runSpec } from '../../../shared/testing'
import { parseDestination } from './parse-destination'
import { parseDestinationSpec } from './parse-destination.spec'

describe('parseDestination', () => {
  runSpec(parseDestination, parseDestinationSpec)
})
