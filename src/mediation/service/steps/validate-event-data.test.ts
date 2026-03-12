import { testSpec } from '../../../shared/spec-framework'
import { validateEventDataSpec } from './validate-event-data.spec'
import { validateEventData } from './validate-event-data'

testSpec('validateEventData', validateEventDataSpec, validateEventData)
