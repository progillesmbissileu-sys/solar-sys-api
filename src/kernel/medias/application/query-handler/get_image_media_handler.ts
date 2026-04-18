import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ImageMediaDetailsDto } from '#kernel/medias/application/dto/image_media_read_dto'
import { GetImageMediaQuery } from '#kernel/medias/application/query/get_image_media_query'
import { ImageMediaReadModel } from '#kernel/medias/application/read-model/image_media_read_model'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'

export class GetImageMediaHandler implements QueryHandler<GetImageMediaQuery, ImageMediaDetailsDto> {
  constructor(private readonly readModel: ImageMediaReadModel) {}

  async handle(query: GetImageMediaQuery): Promise<ImageMediaDetailsDto> {
    const image = await this.readModel.getById(query.imageMediaId)

    if (!image) {
      throw new ImageNotFoundError(query.imageMediaId)
    }

    return image
  }
}
