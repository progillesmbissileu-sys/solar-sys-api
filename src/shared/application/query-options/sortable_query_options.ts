import { SortDirection } from './sort_direction'

export interface SortableQueryOptions<TSortField extends string = string> {
  sortBy: TSortField
  sortDirection: SortDirection
}
