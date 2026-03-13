import { Value } from '@sinclair/typebox/value'
import { ActivateMediationCommand } from './command'
import type { ParseActivateMediationCommandFn } from './parse-command.spec'

export const parseActivateMediationCommand: ParseActivateMediationCommandFn['signature'] = (raw) => {
    if (!Value.Check(ActivateMediationCommand, raw)) {
        const details = [...Value.Errors(ActivateMediationCommand, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_activate_mediation_command'], details }
    }
    return { ok: true, value: raw, successType: ['command-parsed'] }
}
