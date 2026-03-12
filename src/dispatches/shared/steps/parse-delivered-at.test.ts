import { testSpec } from '../../../shared/spec-framework'
import { parseDeliveredAtSpec } from './parse-delivered-at.spec'
import { parseDeliveredAt } from './parse-delivered-at'

testSpec('parseDeliveredAt', parseDeliveredAtSpec, parseDeliveredAt)
