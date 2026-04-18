import EntityManager from '#database/active-records/image_media'
import { ImageMediaReadModel } from '#kernel/medias/application/read-model/image_media_read_model'
import { ImageMediaDetailsDto } from '#kernel/medias/application/dto/image_media_read_dto'

export class ImageMediaARReadModel implements ImageMediaReadModel {
  async getById(imageMediaId: string): Promise<ImageMediaDetailsDto | null> {
    const img = await EntityManager.find(imageMediaId)

    if (!img) {
      return null
    }

    return {
      id: img.id,
      title: img.title,
      url: img.url,
      altDescription: img.altDescription,
      metadata: img.metadata,
      relativeKey: img.relativeKey,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }
  }
}
