import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ImageMediaListItemDto } from '#kernel/medias/application/dto/image_media_read_dto'
import { ImageMediaCollection } from '#kernel/medias/application/collection/image_media_collection'
import { ListImageMediasQuery } from '#kernel/medias/application/query/list_image_medias_query'

export class ListImageMediasHandler implements QueryHandler<
  ListImageMediasQuery,
  PaginatedResultDto<ImageMediaListItemDto>
> {
  constructor(private readonly collection: ImageMediaCollection) {}

  async handle(query: ListImageMediasQuery): Promise<PaginatedResultDto<ImageMediaListItemDto>> {
    return this.collection.list(query)
  }
}
