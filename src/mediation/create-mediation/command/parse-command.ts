import { CreateMediationCommand } from './command'
import type { ParseCreateMediationCommandFn } from './parse-command.spec'

export const parseCreateMediationCommand: ParseCreateMediationCommandFn['signature'] = (raw) => {
    const result = CreateMediationCommand.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_create_mediation_command'], details }
    }
    return { ok: true, value: result.data, successType: ['command-parsed'] }
}
