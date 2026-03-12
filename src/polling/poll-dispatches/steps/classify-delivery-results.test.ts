import { testSpec } from '../../../shared/spec-framework'
import { classifyDeliveryResultsSpec } from './classify-delivery-results.spec'
import { classifyDeliveryResults } from './classify-delivery-results'

testSpec('classifyDeliveryResults', classifyDeliveryResultsSpec, classifyDeliveryResults)
