import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductModifierListItemDto } from '#kernel/product/application/dto/product_modifier_read_dto'
import { ProductModifierCollection } from '#kernel/product/application/collection/product_modifier_collection'
import { ListProductModifiersByGroupQuery } from '#kernel/product/application/query/list_product_modifiers_by_group_query'

export class ListProductModifiersByGroupHandler implements QueryHandler<
  ListProductModifiersByGroupQuery,
  PaginatedResultDto<ProductModifierListItemDto>
> {
  constructor(private readonly collection: ProductModifierCollection) {}

  async handle(query: ListProductModifiersByGroupQuery): Promise<PaginatedResultDto<ProductModifierListItemDto>> {
    return this.collection.list(query)
  }
}
