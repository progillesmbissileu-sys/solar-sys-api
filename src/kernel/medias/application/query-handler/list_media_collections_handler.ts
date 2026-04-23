import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { MediaCollectionListItemDto } from '#kernel/medias/application/dto/media_collection_read_dto'
import { MediaCollectionCollection } from '#kernel/medias/application/collection/media_collection_collection'
import { ListMediaCollectionsQuery } from '#kernel/medias/application/query/list_media_collections_query'

export class ListMediaCollectionsHandler implements QueryHandler<
  ListMediaCollectionsQuery,
  PaginatedResultDto<MediaCollectionListItemDto>
> {
  constructor(private readonly collection: MediaCollectionCollection) {}

  async handle(
    query: ListMediaCollectionsQuery
  ): Promise<PaginatedResultDto<MediaCollectionListItemDto>> {
    return this.collection.list(query)
  }
}
