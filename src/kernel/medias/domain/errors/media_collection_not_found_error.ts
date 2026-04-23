import { DomainError } from '#shared/domain/errors/domain_error'

export class MediaCollectionNotFoundError extends DomainError {
  constructor(collectionId: string) {
    super('MEDIA_COLLECTION_NOT_FOUND', `Media collection for id: "${collectionId}" not found`, {
      collectionId,
    })
  }
}
