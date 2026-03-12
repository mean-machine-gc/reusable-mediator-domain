import { testSpec } from '../../../shared/spec-framework'
import { parseDeliveryErrorSpec } from './parse-delivery-error.spec'
import { parseDeliveryError } from './parse-delivery-error'

testSpec('parseDeliveryError', parseDeliveryErrorSpec, parseDeliveryError)
