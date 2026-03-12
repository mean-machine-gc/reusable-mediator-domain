import { testSpec } from '../../../shared/spec-framework'
import { executeFiltersSpec } from './execute-filters.spec'
import { executeFilters } from './execute-filters'

testSpec('executeFilters', executeFiltersSpec, executeFilters)
