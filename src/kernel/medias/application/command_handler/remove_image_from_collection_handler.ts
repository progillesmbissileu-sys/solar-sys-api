import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { RemoveImageFromCollectionCommand } from '#kernel/medias/application/command/remove_image_from_collection_command'
import { CollectionItemRepository } from '#kernel/medias/domain/collection_item_repository'
import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { MediaCollectionNotFoundError } from '#kernel/medias/domain/errors/media_collection_not_found_error'

export class RemoveImageFromCollectionHandler implements CommandHandler<
  RemoveImageFromCollectionCommand,
  void
> {
  constructor(
    private readonly collectionRepository: MediaCollectionRepository,
    private readonly collectionItemRepository: CollectionItemRepository
  ) {}

  async handle(command: RemoveImageFromCollectionCommand): Promise<void> {
    const collection = await this.collectionRepository.findById(command.collectionId)

    if (!collection) {
      throw new MediaCollectionNotFoundError(command.collectionId)
    }

    await this.collectionItemRepository.delete(command.collectionId, command.imageId)
  }
}
