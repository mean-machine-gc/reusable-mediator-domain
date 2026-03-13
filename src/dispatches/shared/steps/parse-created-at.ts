import type { ParseCreatedAtFn } from './parse-created-at.spec'
import { parseTimestamp } from '../../../shared/primitives'

export const parseCreatedAt: ParseCreatedAtFn['signature'] = (raw) =>
    parseTimestamp(raw, 'created-at-parsed')
