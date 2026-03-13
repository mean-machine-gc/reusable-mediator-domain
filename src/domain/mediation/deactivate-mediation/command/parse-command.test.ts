import { testSpec } from '../../../shared/spec-framework'
import { parseDeactivateMediationCommandSpec } from './parse-command.spec'
import { parseDeactivateMediationCommand } from './parse-command'

testSpec('parseDeactivateMediationCommand', parseDeactivateMediationCommandSpec, parseDeactivateMediationCommand)
