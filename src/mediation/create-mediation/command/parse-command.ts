import { Value } from '@sinclair/typebox/value'
import { CreateMediationCommand } from './command'
import type { ParseCreateMediationCommandFn } from './parse-command.spec'

export const parseCreateMediationCommand: ParseCreateMediationCommandFn['signature'] = (raw) => {
    if (!Value.Check(CreateMediationCommand, raw)) {
        const details = [...Value.Errors(CreateMediationCommand, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_create_mediation_command'], details }
    }
    return { ok: true, value: raw, successType: ['command-parsed'] }
}
