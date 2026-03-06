import { Query } from '#shared/application/use-cases/query'
import { ProductCategoryListProductsSortField } from '../services/product_category_read_repository'
import { SortDirection } from '#shared/application/query-options/sort_direction'

export class ListProductsByCategoryQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly categoryId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly search: string,
    public readonly sortBy: ProductCategoryListProductsSortField,
    public readonly sortDirection: SortDirection
  ) {
    this.timestamp = new Date()
  }
}
