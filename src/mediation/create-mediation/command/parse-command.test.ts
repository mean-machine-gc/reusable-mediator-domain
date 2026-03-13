import { testSpec } from '../../../shared/spec-framework'
import { parseCreateMediationCommandSpec } from './parse-command.spec'
import { parseCreateMediationCommand } from './parse-command'

testSpec('parseCreateMediationCommand', parseCreateMediationCommandSpec, parseCreateMediationCommand)
