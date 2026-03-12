import { testSpec } from '../../../shared/spec-framework'
import { parseDestinationSpec } from './parse-destination.spec'
import { parseDestination } from './parse-destination'

testSpec('parseDestination', parseDestinationSpec, parseDestination)
