import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { MediaCollectionDetailsDto } from '#kernel/medias/application/dto/media_collection_read_dto'
import { GetMediaCollectionQuery } from '#kernel/medias/application/query/get_media_collection_query'
import { MediaCollectionReadModel } from '#kernel/medias/application/read-model/media_collection_read_model'
import { MediaCollectionNotFoundError } from '#kernel/medias/domain/errors/media_collection_not_found_error'

export class GetMediaCollectionHandler implements QueryHandler<
  GetMediaCollectionQuery,
  MediaCollectionDetailsDto
> {
  constructor(private readonly readModel: MediaCollectionReadModel) {}

  async handle(query: GetMediaCollectionQuery): Promise<MediaCollectionDetailsDto> {
    const collection = await this.readModel.getById(query.collectionId)

    if (!collection) {
      throw new MediaCollectionNotFoundError(query.collectionId)
    }

    return collection
  }
}
