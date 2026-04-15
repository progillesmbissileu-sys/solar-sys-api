import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductModifierGroupListItemDto } from '#kernel/product/application/dto/product_modifier_read_dto'
import { ProductModifierGroupCollection } from '#kernel/product/application/collection/product_modifier_group_collection'
import { ListProductModifierGroupsQuery } from '#kernel/product/application/query/list_product_modifier_groups_query'

export class ListProductModifierGroupsHandler implements QueryHandler<
  ListProductModifierGroupsQuery,
  PaginatedResultDto<ProductModifierGroupListItemDto>
> {
  constructor(private readonly collection: ProductModifierGroupCollection) {}

  async handle(query: ListProductModifierGroupsQuery): Promise<PaginatedResultDto<ProductModifierGroupListItemDto>> {
    return this.collection.list(query)
  }
}
