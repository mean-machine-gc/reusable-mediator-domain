import { testSpec } from '../../../shared/spec-framework'
import { mediateCoreSpec } from './mediate.spec'
import { mediateCore } from './mediate'

testSpec('mediateCore', mediateCoreSpec, mediateCore)
