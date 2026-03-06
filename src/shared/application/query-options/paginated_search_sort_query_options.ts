import { PaginatedSearchQueryOptions } from './paginated_search_query_options'
import { SortableQueryOptions } from './sortable_query_options'

export interface PaginatedSearchSortQueryOptions<TSortField extends string = string>
  extends PaginatedSearchQueryOptions,
    SortableQueryOptions<TSortField> {}
