import { Value } from '@sinclair/typebox/value'
import { DeactivateMediationCommand } from './command'
import type { ParseDeactivateMediationCommandFn } from './parse-command.spec'

export const parseDeactivateMediationCommand: ParseDeactivateMediationCommandFn['signature'] = (raw) => {
    if (!Value.Check(DeactivateMediationCommand, raw)) {
        const details = [...Value.Errors(DeactivateMediationCommand, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_deactivate_mediation_command'], details }
    }
    return { ok: true, value: raw, successType: ['command-parsed'] }
}
