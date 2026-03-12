import { testSpec } from '../../../shared/spec-framework'
import { parseDataschemaUriSpec } from './parse-dataschema-uri.spec'
import { parseDataschemaUri } from './parse-dataschema-uri'

testSpec('parseDataschemaUri', parseDataschemaUriSpec, parseDataschemaUri)
