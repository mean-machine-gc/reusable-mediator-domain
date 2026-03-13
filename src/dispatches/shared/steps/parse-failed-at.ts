import type { ParseFailedAtFn } from './parse-failed-at.spec'
import { parseTimestamp } from '../../../shared/primitives'

export const parseFailedAt: ParseFailedAtFn['signature'] = (raw) =>
    parseTimestamp(raw, 'failed-at-parsed')
