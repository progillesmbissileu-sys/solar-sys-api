import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListStoreQuery } from '#kernel/store/application/query/list_stores_query'
import { StoreListItemDto } from '#kernel/store/application/dto/store_dto'
import { StoreCollection } from '../collection/store_collection'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'

export class ListStoreQueryHandler implements QueryHandler<
  ListStoreQuery,
  PaginatedResultDto<StoreListItemDto>
> {
  constructor(private readonly collectionService: StoreCollection) {}

  handle(query: ListStoreQuery): Promise<PaginatedResultDto<StoreListItemDto>> {
    return this.collectionService.collection(query)
  }
}
