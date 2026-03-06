import { Query } from '#shared/application/use-cases/query'
import { ProductListSortField } from '../services/product_read_repository'
import { SortDirection } from '#shared/application/query-options/sort_direction'

export class ListProductsQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly search: string,
    public readonly sortBy: ProductListSortField,
    public readonly sortDirection: SortDirection
  ) {
    this.timestamp = new Date()
  }
}
