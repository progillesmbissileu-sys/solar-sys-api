import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { ImageMedia } from '#kernel/medias/domain/image_media'
import { default as EntityActiveRecord } from '#database/active-records/image_media'
import { IdentifierInterface } from '#shared/domain/identifier_interface'
export class ImageMediaARRepository implements ImageMediaRepository {
  async save(entity: ImageMedia): Promise<void> {
    const object = {
      url: entity['url'],
      title: entity['title'],
      altDescription: entity['altDescription'],
      metadata: entity['metadata'],
      createdAt: entity['createdAt'] as any,
      updatedAt: entity['updatedAt'] as any,
    }

    entity.getId()
      ? await EntityActiveRecord.updateOrCreate({ id: entity.getId() }, object)
      : await EntityActiveRecord.create(object)
  }

  async findById(_id: string): Promise<ImageMedia | null> {
    const image = await EntityActiveRecord.findOrFail(_id)

    return new ImageMedia(
      new IdentifierInterface(image.id),
      image.title,
      image.url,
      image.altDescription,
      JSON.parse(image.metadata),
      image.createdAt as any,
      image.updatedAt as any,
      image.createdBy
    )
  }

  async findByUrl(_url: string): Promise<ImageMedia | null> {
    const image = await EntityActiveRecord.findBy('url', _url)

    if (!image) {
      return null
    }

    return new ImageMedia(
      new IdentifierInterface(image.id),
      image.title,
      image.url,
      image.altDescription,
      JSON.parse(image.metadata),
      image.createdAt as any,
      image.updatedAt as any,
      image.createdBy
    )
  }
}
