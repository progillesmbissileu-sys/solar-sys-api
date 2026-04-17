import {
  ProductModifierGroupListItemDto,
  ProductModifierGroupByProductDto,
} from '#kernel/product/application/dto/product_modifier_group_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListProductModifierGroupsQuery } from '#kernel/product/application/query/list_product_modifier_groups_query'
import { ListProductModifierGroupsByProductQuery } from '#kernel/product/application/query/list_product_modifier_groups_by_product_query'

export interface ProductModifierGroupCollection {
  list(
    query: ListProductModifierGroupsQuery
  ): Promise<PaginatedResultDto<ProductModifierGroupListItemDto>>
  listByProduct(
    query: ListProductModifierGroupsByProductQuery
  ): Promise<PaginatedResultDto<ProductModifierGroupByProductDto>>
}
