import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { CollectionItem } from '#kernel/medias/domain/collection_item'

export interface CollectionItemRepository extends RepositoryInterface {
  save(item: CollectionItem): Promise<string | void>
  saveMany(items: CollectionItem[]): Promise<void>
  findByCollection(collectionId: string): Promise<CollectionItem[]>
  delete(collectionId: string, imageId: string): Promise<void>
  deleteByCollection(collectionId: string): Promise<void>
  reorder(collectionId: string, items: { imageId: string; sortOrder: number }[]): Promise<void>
}
