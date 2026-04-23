import { CollectionItemRepository } from '#kernel/medias/domain/collection_item_repository'
import { CollectionItem } from '#kernel/medias/domain/collection_item'
import { default as EntityActiveRecord } from '#database/active-records/collection_image'

export class CollectionItemARRepository implements CollectionItemRepository {
  async save(item: CollectionItem): Promise<string | void> {
    const object = {
      collectionId: item.getCollectionId() as any,
      imageId: item.getImageId() as any,
      sortOrder: item.getSortOrder(),
    }

    const existing = await EntityActiveRecord.query()
      .where('collection_id', item.getCollectionId())
      .where('image_id', item.getImageId())
      .first()

    if (existing) {
      await EntityActiveRecord.updateOrCreate({ id: existing.id }, object)
      return Promise.resolve()
    }

    const result = await EntityActiveRecord.create(object)

    return result.id
  }

  async saveMany(items: CollectionItem[]): Promise<void> {
    const data = items.map((item) => ({
      collectionId: item.getCollectionId() as any,
      imageId: item.getImageId() as any,
      sortOrder: item.getSortOrder(),
    }))

    await EntityActiveRecord.createMany(data)
  }

  async findByCollection(collectionId: string): Promise<CollectionItem[]> {
    const items = await EntityActiveRecord.query()
      .where('collection_id', collectionId)
      .orderBy('sort_order', 'asc')

    return items.map((item) => new CollectionItem(item.collectionId, item.imageId, item.sortOrder))
  }

  async delete(collectionId: string, imageId: string): Promise<void> {
    const item = await EntityActiveRecord.query()
      .where('collection_id', collectionId)
      .where('image_id', imageId)
      .firstOrFail()

    await item.delete()
  }

  async deleteByCollection(collectionId: string): Promise<void> {
    await EntityActiveRecord.query().where('collection_id', collectionId).delete()
  }

  async reorder(
    collectionId: string,
    items: { imageId: string; sortOrder: number }[]
  ): Promise<void> {
    for (const item of items) {
      await EntityActiveRecord.query()
        .where('collection_id', collectionId)
        .where('image_id', item.imageId)
        .update({ sort_order: item.sortOrder })
    }
  }
}
