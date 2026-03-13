import { DeactivateMediationCommand } from './command'
import type { ParseDeactivateMediationCommandFn } from './parse-command.spec'

export const parseDeactivateMediationCommand: ParseDeactivateMediationCommandFn['signature'] = (raw) => {
    const result = DeactivateMediationCommand.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_deactivate_mediation_command'], details }
    }
    return { ok: true, value: result.data, successType: ['command-parsed'] }
}
