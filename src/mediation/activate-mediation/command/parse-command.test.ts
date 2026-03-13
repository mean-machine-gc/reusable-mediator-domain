import { testSpec } from '../../../shared/spec-framework'
import { parseActivateMediationCommandSpec } from './parse-command.spec'
import { parseActivateMediationCommand } from './parse-command'

testSpec('parseActivateMediationCommand', parseActivateMediationCommandSpec, parseActivateMediationCommand)
