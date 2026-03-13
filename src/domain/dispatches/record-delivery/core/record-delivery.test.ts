import { testSpec } from '../../../shared/spec-framework'
import { recordDeliverySpec } from './record-delivery.spec'
import { recordDelivery } from './record-delivery'

testSpec('recordDelivery', recordDeliverySpec, recordDelivery)
