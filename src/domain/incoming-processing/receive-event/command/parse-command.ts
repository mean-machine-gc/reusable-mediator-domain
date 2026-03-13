import { ReceiveEventCommand } from './command'
import type { ParseReceiveEventCommandFn } from './parse-command.spec'

export const parseReceiveEventCommand: ParseReceiveEventCommandFn['signature'] = (raw) => {
    const result = ReceiveEventCommand.safeParse(raw)
    if (!result.success) {
        const details = result.error.issues.map(i => i.message)
        return { ok: false, errors: ['invalid_receive_event_command'], details }
    }
    return { ok: true, value: result.data, successType: ['command-parsed'] }
}
