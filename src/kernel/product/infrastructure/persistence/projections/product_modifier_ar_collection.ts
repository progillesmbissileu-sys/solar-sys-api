import ProductModifier from '#database/active-records/product_modifier'
import { ProductModifierCollection } from '#kernel/product/application/collection/product_modifier_collection'
import { ProductModifierListItemDto } from '#kernel/product/application/dto/product_modifier_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListProductModifiersByGroupQuery } from '#kernel/product/application/query/list_product_modifiers_by_group_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

type ProductModifierActiveRecordWithRelations = ProductModifier

export class ProductModifierARCollection
  extends ModelQueryBuilderHelper
  implements ProductModifierCollection
{
  async list(
    query: ListProductModifiersByGroupQuery
  ): Promise<PaginatedResultDto<ProductModifierListItemDto>> {
    let queryBuilder = ProductModifier.query()

    // Filter by modifier group
    queryBuilder.where('modifier_group_id', query.modifierGroupId)

    // Apply search filter
    if (query.searchQuery.search) {
      queryBuilder.whereILike('designation', `%${query.searchQuery.search}%`)
    }

    // Apply sort
    this.applySort(query.order, ['sort_index', 'designation', 'created_at'], queryBuilder)

    // Apply pagination
    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<ProductModifierActiveRecordWithRelations, ProductModifierListItemDto>(
      result as any,
      async (modifier) => {
        return {
          id: modifier.id,
          designation: modifier.designation,
          modifierGroupId: modifier.modifierGroupId,
          priceAdjustment: modifier.priceAdjustment,
          adjustmentType: modifier.adjustmentType as 'fixed' | 'percentage',
          available: modifier.available,
          sortIndex: modifier.sortIndex,
          createdAt: modifier.createdAt,
          updatedAt: modifier.updatedAt,
        }
      }
    )
  }
}
