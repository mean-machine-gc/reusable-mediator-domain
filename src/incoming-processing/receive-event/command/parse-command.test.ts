import { testSpec } from '../../../shared/spec-framework'
import { parseReceiveEventCommandSpec } from './parse-command.spec'
import { parseReceiveEventCommand } from './parse-command'

testSpec('parseReceiveEventCommand', parseReceiveEventCommandSpec, parseReceiveEventCommand)
