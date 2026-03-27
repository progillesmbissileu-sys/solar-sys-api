import { StoreListItemDto } from '#kernel/store/application/dto/store_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListStoreQuery } from '#kernel/store/application/query/list_stores_query'

export interface StoreCollection {
  collection(query: ListStoreQuery): Promise<PaginatedResultDto<StoreListItemDto>>
}
