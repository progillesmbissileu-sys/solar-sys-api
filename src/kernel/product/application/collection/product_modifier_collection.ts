import { ProductModifierListItemDto } from '#kernel/product/application/dto/product_modifier_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListProductModifiersByGroupQuery } from '#kernel/product/application/query/list_product_modifiers_by_group_query'

export interface ProductModifierCollection {
  list(query: ListProductModifiersByGroupQuery): Promise<PaginatedResultDto<ProductModifierListItemDto>>
}
