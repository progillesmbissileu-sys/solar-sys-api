import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductModifierGroupByProductDto } from '#kernel/product/application/dto/product_modifier_group_read_dto'
import { ProductModifierGroupCollection } from '#kernel/product/application/collection/product_modifier_group_collection'
import { ListProductModifierGroupsByProductQuery } from '#kernel/product/application/query/list_product_modifier_groups_by_product_query'

export class ListProductModifierGroupsByProductHandler implements QueryHandler<
  ListProductModifierGroupsByProductQuery,
  PaginatedResultDto<ProductModifierGroupByProductDto>
> {
  constructor(private readonly collection: ProductModifierGroupCollection) {}

  async handle(
    query: ListProductModifierGroupsByProductQuery
  ): Promise<PaginatedResultDto<ProductModifierGroupByProductDto>> {
    return this.collection.listByProduct(query)
  }
}
