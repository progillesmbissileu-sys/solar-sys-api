import { MediaCollectionListItemDto } from '#kernel/medias/application/dto/media_collection_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListMediaCollectionsQuery } from '#kernel/medias/application/query/list_media_collections_query'

export interface MediaCollectionCollection {
  list(query: ListMediaCollectionsQuery): Promise<PaginatedResultDto<MediaCollectionListItemDto>>
}
