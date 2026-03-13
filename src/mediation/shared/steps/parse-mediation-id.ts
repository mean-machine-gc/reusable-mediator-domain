import type { ParseMediationIdFn } from './parse-mediation-id.spec'
import { parseId } from '../../../shared/primitives'

export const parseMediationId: ParseMediationIdFn['signature'] = (raw) =>
    parseId(raw, 'mediation-id-parsed')
