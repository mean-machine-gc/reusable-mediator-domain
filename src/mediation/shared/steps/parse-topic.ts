// parse-topic.ts
import type { Result } from '../../../shared/spec'
import type { Topic } from '../../types'
import type { ParseTopicFailure, ParseTopicSuccess } from './parse-topic.spec'
import { parseTopicSpec } from './parse-topic.spec'

export const parseTopic = (input: unknown): Result<Topic, ParseTopicFailure, ParseTopicSuccess> => {
  if (typeof input !== 'string')
    return { ok: false, errors: ['not_a_string'] }

  const errors: ParseTopicFailure[] = []

  for (const [failure, constraint] of Object.entries(parseTopicSpec.constraints)) {
    if (failure === 'not_a_string') continue
    if (!constraint.predicate({ input })) errors.push(failure as ParseTopicFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as Topic, successType: ['topic-parsed'] }
}
