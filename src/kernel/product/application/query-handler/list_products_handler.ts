import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductListItemDto } from '#kernel/product/application/dto/product_read_dto'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'

export class ListProductsHandler implements QueryHandler<
  ListProductsQuery,
  PaginatedResultDto<ProductListItemDto>
> {
  constructor(private readonly repository: ProductCollection) {}

  async handle(query: ListProductsQuery): Promise<PaginatedResultDto<ProductListItemDto>> {
    return this.repository.list(query)
  }
}
