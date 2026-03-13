import { Value } from '@sinclair/typebox/value'
import { ReceiveEventCommand } from './command'
import type { ParseReceiveEventCommandFn } from './parse-command.spec'

export const parseReceiveEventCommand: ParseReceiveEventCommandFn['signature'] = (raw) => {
    if (!Value.Check(ReceiveEventCommand, raw)) {
        const details = [...Value.Errors(ReceiveEventCommand, raw)].map(e => e.message)
        return { ok: false, errors: ['invalid_receive_event_command'], details }
    }
    return { ok: true, value: raw, successType: ['command-parsed'] }
}
