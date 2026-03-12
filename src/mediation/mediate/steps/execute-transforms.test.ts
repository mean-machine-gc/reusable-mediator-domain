import { testSpec } from '../../../shared/spec-framework'
import { executeTransformsSpec } from './execute-transforms.spec'
import { executeTransforms } from './execute-transforms'

testSpec('executeTransforms', executeTransformsSpec, executeTransforms)
