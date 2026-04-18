import { ImageMediaListItemDto } from '#kernel/medias/application/dto/image_media_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListImageMediasQuery } from '#kernel/medias/application/query/list_image_medias_query'

export interface ImageMediaCollection {
  list(query: ListImageMediasQuery): Promise<PaginatedResultDto<ImageMediaListItemDto>>
}
