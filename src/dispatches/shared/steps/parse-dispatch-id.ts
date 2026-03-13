import type { ParseDispatchIdFn } from './parse-dispatch-id.spec'
import { parseId } from '../../../shared/primitives'

export const parseDispatchId: ParseDispatchIdFn['signature'] = (raw) =>
    parseId(raw, 'dispatch-id-parsed')
