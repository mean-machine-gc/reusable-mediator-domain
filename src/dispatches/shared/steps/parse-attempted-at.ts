import type { ParseAttemptedAtFn } from './parse-attempted-at.spec'
import { parseTimestamp } from '../../../shared/primitives'

export const parseAttemptedAt: ParseAttemptedAtFn['signature'] = (raw) =>
    parseTimestamp(raw, 'attempted-at-parsed')
