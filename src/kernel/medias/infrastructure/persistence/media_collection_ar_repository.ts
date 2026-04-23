import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { MediaCollection } from '#kernel/medias/domain/media_collection'
import { default as EntityActiveRecord } from '#database/active-records/media_collection'
import { AppId } from '#shared/domain/app_id'

export class MediaCollectionARRepository implements MediaCollectionRepository {
  async save(entity: MediaCollection): Promise<string | void> {
    const object = {
      name: entity.getName(),
      description: entity.getDescription(),
      createdAt: entity.getCreatedAt() as any,
      updatedAt: entity.getUpdatedAt() as any,
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId() }, object)
      return Promise.resolve()
    }

    const result = await EntityActiveRecord.create(object)

    return result.id
  }

  async findById(_id: string): Promise<MediaCollection | null> {
    const collection = await EntityActiveRecord.find(_id)

    if (!collection) {
      return null
    }

    return new MediaCollection(
      new AppId(collection.id),
      collection.name,
      collection.description,
      collection.createdAt as any,
      collection.updatedAt as any
    )
  }

  async findByName(_name: string): Promise<MediaCollection | null> {
    const collection = await EntityActiveRecord.findBy('name', _name)

    if (!collection) {
      return null
    }

    return new MediaCollection(
      new AppId(collection.id),
      collection.name,
      collection.description,
      collection.createdAt as any,
      collection.updatedAt as any
    )
  }

  async delete(id: string): Promise<void> {
    const collection = await EntityActiveRecord.findOrFail(id)
    await collection.delete()
  }
}
