import type { ParseDeliveredAtFn } from './parse-delivered-at.spec'
import { parseTimestamp } from '../../../shared/primitives'

export const parseDeliveredAt: ParseDeliveredAtFn['signature'] = (raw) =>
    parseTimestamp(raw, 'delivered-at-parsed')
