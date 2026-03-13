import { ActivateMediationCommand } from './command'
import type { ParseActivateMediationCommandFn } from './parse-command.spec'

export const parseActivateMediationCommand: ParseActivateMediationCommandFn['signature'] = (raw) => {
    const result = ActivateMediationCommand.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_activate_mediation_command'], details }
    }
    return { ok: true, value: result.data, successType: ['command-parsed'] }
}
