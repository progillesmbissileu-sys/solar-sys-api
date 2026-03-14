import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { CategoryProductListItemDto } from '#kernel/product/application/dto/product_category_read_dto'
import { ProductCategoryCollection } from '#kernel/product/application/collection/product_category_collection'
import { ListProductsByCategoryQuery } from '#kernel/product/application/query/list_products_by_category_query'

export class ListProductsByCategoryHandler implements QueryHandler<
  ListProductsByCategoryQuery,
  PaginatedResultDto<CategoryProductListItemDto>
> {
  constructor(private readonly repository: ProductCategoryCollection) {}

  async handle(
    query: ListProductsByCategoryQuery
  ): Promise<PaginatedResultDto<CategoryProductListItemDto>> {
    return this.repository.listProducts(query)
  }
}
