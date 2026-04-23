import { MediaCollectionDetailsDto } from '#kernel/medias/application/dto/media_collection_read_dto'

export interface MediaCollectionReadModel {
  getById(collectionId: string): Promise<MediaCollectionDetailsDto | null>
}
