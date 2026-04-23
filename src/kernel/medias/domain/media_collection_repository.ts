import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { MediaCollection } from '#kernel/medias/domain/media_collection'

export interface MediaCollectionRepository extends RepositoryInterface {
  save(collection: MediaCollection): Promise<string | void>
  findById(id: string): Promise<MediaCollection | null>
  findByName(name: string): Promise<MediaCollection | null>
  delete(id: string): Promise<void>
}
