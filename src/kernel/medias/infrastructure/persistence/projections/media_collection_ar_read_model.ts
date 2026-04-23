import EntityManager from '#database/active-records/media_collection'
import CollectionImageAR from '#database/active-records/collection_image'
import { MediaCollectionReadModel } from '#kernel/medias/application/read-model/media_collection_read_model'
import {
  MediaCollectionDetailsDto,
  CollectionImageDto,
} from '#kernel/medias/application/dto/media_collection_read_dto'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'

export class MediaCollectionARReadModel implements MediaCollectionReadModel {
  constructor(private readonly mediaManager: MediaManagerInterface) {}

  async getById(collectionId: string): Promise<MediaCollectionDetailsDto | null> {
    const collection = await EntityManager.find(collectionId)

    if (!collection) {
      return null
    }

    const collectionImages = await CollectionImageAR.query()
      .where('collection_id', collectionId)
      .orderBy('sort_order', 'asc')
      .preload('image')

    const images: CollectionImageDto[] = await Promise.all(
      collectionImages.map(async (ci) => ({
        id: ci.id,
        imageId: ci.imageId,
        url: ci.image?.relativeKey
          ? await this.mediaManager.getSignedUrl(ci.image.relativeKey)
          : (ci.image?.url ?? null),
        altDescription: ci.image?.altDescription ?? '',
        sortOrder: ci.sortOrder,
      }))
    )

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      images,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    }
  }
}
