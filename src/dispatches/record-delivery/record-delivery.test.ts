import { testSpec } from '../../shared/spec-framework'
import { recordDeliveryShellSpec, testDeps } from './record-delivery.spec'
import { _recordDelivery } from './record-delivery'

testSpec('recordDeliveryShell', recordDeliveryShellSpec, _recordDelivery(testDeps))
