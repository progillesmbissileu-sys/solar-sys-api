import EntityManager from '#database/active-records/media_collection'
import { MediaCollectionCollection } from '#kernel/medias/application/collection/media_collection_collection'
import { MediaCollectionListItemDto } from '#kernel/medias/application/dto/media_collection_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListMediaCollectionsQuery } from '#kernel/medias/application/query/list_media_collections_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

export class MediaCollectionARCollection
  extends ModelQueryBuilderHelper
  implements MediaCollectionCollection
{
  async list(
    query: ListMediaCollectionsQuery
  ): Promise<PaginatedResultDto<MediaCollectionListItemDto>> {
    let queryBuilder = EntityManager.query()

    queryBuilder.whereILike('name', `%${query.searchQuery.search}%`)
    this.applySort(query.order, ['created_at'], queryBuilder)

    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<any, MediaCollectionListItemDto>(result as any, (col) => ({
      id: col.id,
      name: col.name,
      description: col.description,
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    }))
  }
}
