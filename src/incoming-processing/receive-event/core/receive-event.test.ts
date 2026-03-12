import { testSpec } from '../../../shared/spec-framework'
import { receiveEventSpec } from './receive-event.spec'
import { receiveEvent } from './receive-event'

testSpec('receiveEvent', receiveEventSpec, receiveEvent)
