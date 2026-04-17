import ProductModifierGroup from '#database/active-records/product_modifier_group'
import { ProductModifierGroupCollection } from '#kernel/product/application/collection/product_modifier_group_collection'
import {
  ProductModifierGroupListItemDto,
  ProductModifierGroupByProductDto,
} from '#kernel/product/application/dto/product_modifier_group_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListProductModifierGroupsQuery } from '#kernel/product/application/query/list_product_modifier_groups_query'
import { ListProductModifierGroupsByProductQuery } from '#kernel/product/application/query/list_product_modifier_groups_by_product_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

type ProductModifierGroupActiveRecordWithRelations = ProductModifierGroup & {
  modifiers?: Array<{
    id: string
    designation: string
    priceAdjustment: number
    adjustmentType: 'fixed' | 'percentage'
    available: boolean
    sortIndex: number
  }>
}

export class ProductModifierGroupARCollection
  extends ModelQueryBuilderHelper
  implements ProductModifierGroupCollection
{
  async list(
    query: ListProductModifierGroupsQuery
  ): Promise<PaginatedResultDto<ProductModifierGroupListItemDto>> {
    let queryBuilder = ProductModifierGroup.query()

    // Apply search filters
    if (query.searchQuery.search) {
      queryBuilder.whereILike('designation', `%${query.searchQuery.search}%`)
    }

    // Apply sort
    this.applySort(
      query.order,
      ['sort_index', 'designation', 'created_at', 'updated_at'],
      queryBuilder
    )

    // Apply pagination
    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<
      ProductModifierGroupActiveRecordWithRelations,
      ProductModifierGroupListItemDto
    >(result as any, async (group) => {
      // Load modifiers count
      const modifiersCount = await ProductModifierGroup.query()
        .where('id', group.id)
        .withCount('modifiers')
        .first()

      return {
        id: group.id,
        designation: group.designation,
        selectionType: group.selectionType,
        required: group.required,
        available: group.available,
        sortIndex: group.sortIndex,
        modifierCount: modifiersCount?.$extras.modifiers_count || 0,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      }
    })
  }

  async listByProduct(
    query: ListProductModifierGroupsByProductQuery
  ): Promise<PaginatedResultDto<ProductModifierGroupByProductDto>> {
    let queryBuilder = ProductModifierGroup.query()
      .join(
        'product_modifier_group_product',
        'product_modifier_groups.id',
        'product_modifier_group_product.modifier_group_id'
      )
      .where('product_modifier_group_product.product_id', query.productId)
      .select('product_modifier_groups.*')
      .select('product_modifier_group_product.sort_index as pivot_sort_index')
      .preload('modifiers', (modifiersQuery) => {
        modifiersQuery.select('designation', 'price_adjustment', 'adjustment_type', 'available')
      })

    // Apply search filters
    if (query.searchQuery.search) {
      queryBuilder.whereILike(
        'product_modifier_groups.designation',
        `%${query.searchQuery.search}%`
      )
    }

    // Apply sort
    this.applySort(
      query.order,
      ['sort_index', 'designation', 'created_at', 'updated_at'],
      queryBuilder
    )

    // Apply pagination
    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<any, ProductModifierGroupByProductDto>(
      result as any,
      async (group) => {
        return {
          id: group.id,
          designation: group.designation,
          required: group.required,
          available: group.available,
          modifiers: group.modifiers.map((modifier: any) => ({
            designation: modifier.designation,
            priceAdjustment: modifier.priceAdjustment,
            adjustmentType: modifier.adjustmentType,
            available: modifier.available,
          })),
        }
      }
    )
  }
}
