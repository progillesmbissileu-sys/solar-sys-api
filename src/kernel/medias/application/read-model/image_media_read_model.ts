import { ImageMediaDetailsDto } from '#kernel/medias/application/dto/image_media_read_dto'

export interface ImageMediaReadModel {
  getById(imageMediaId: string): Promise<ImageMediaDetailsDto | null>
}
