import EntityManager from '#database/active-records/image_media'
import { ImageMediaReadModel } from '#kernel/medias/application/read-model/image_media_read_model'
import { ImageMediaDetailsDto } from '#kernel/medias/application/dto/image_media_read_dto'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'

export class ImageMediaARReadModel implements ImageMediaReadModel {
  constructor(private readonly mediaManager: MediaManagerInterface) {}

  async getById(imageMediaId: string): Promise<ImageMediaDetailsDto | null> {
    const img = await EntityManager.find(imageMediaId)

    if (!img) {
      return null
    }

    return {
      id: img.id,
      title: img.title,
      url: await this.getSignedUrl(img.relativeKey),
      altDescription: img.altDescription,
      metadata: img.metadata,
      relativeKey: img.relativeKey,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }
  }

  private async getSignedUrl(relativeKey?: string | null): Promise<string | null> {
    if (!relativeKey) {
      return null
    }

    return this.mediaManager.getSignedUrl(relativeKey)
  }
}
