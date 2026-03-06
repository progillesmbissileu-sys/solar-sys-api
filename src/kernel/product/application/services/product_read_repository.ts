import {
  GroupedProductsByCategoryDto,
  PaginatedResultDto,
  ProductDetailsDto,
  ProductListItemDto,
} from '#kernel/product/application/dto/product_read_dto'
import { PaginatedSearchQueryOptions } from '#shared/application/query-options/paginated_search_query_options'
import { PaginatedSearchSortQueryOptions } from '#shared/application/query-options/paginated_search_sort_query_options'

export type ProductListSortField = 'created_at'

export interface ProductReadRepository {
  list(
    params: PaginatedSearchSortQueryOptions<ProductListSortField>
  ): Promise<PaginatedResultDto<ProductListItemDto>>
  getById(productId: string): Promise<ProductDetailsDto | null>
  listGroupedByCategory(
    params: PaginatedSearchQueryOptions
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>>
}
