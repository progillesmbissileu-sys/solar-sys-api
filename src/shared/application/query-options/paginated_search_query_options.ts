import { PaginatedQueryOptions } from './paginated_query_options'
import { SearchableQueryOptions } from './searchable_query_options'

export interface PaginatedSearchQueryOptions
  extends PaginatedQueryOptions,
    SearchableQueryOptions {}
