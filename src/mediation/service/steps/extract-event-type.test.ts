import { testSpec } from '../../../shared/spec-framework'
import { extractEventTypeSpec } from './extract-event-type.spec'
import { extractEventType } from './extract-event-type'

testSpec('extractEventType', extractEventTypeSpec, extractEventType)
