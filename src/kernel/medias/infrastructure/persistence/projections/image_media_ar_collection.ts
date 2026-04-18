import EntityManager from '#database/active-records/image_media'
import { ImageMediaCollection } from '#kernel/medias/application/collection/image_media_collection'
import { ImageMediaListItemDto } from '#kernel/medias/application/dto/image_media_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListImageMediasQuery } from '#kernel/medias/application/query/list_image_medias_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

export class ImageMediaARCollection
  extends ModelQueryBuilderHelper
  implements ImageMediaCollection
{
  async list(query: ListImageMediasQuery): Promise<PaginatedResultDto<ImageMediaListItemDto>> {
    let queryBuilder = EntityManager.query()

    queryBuilder.whereILike('title', `%${query.searchQuery.search}%`)
    this.applySort(query.order, ['created_at'], queryBuilder)

    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<any, ImageMediaListItemDto>(result as any, (img) => ({
      id: img.id,
      title: img.title,
      url: img.url,
      altDescription: img.altDescription,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }))
  }
}
