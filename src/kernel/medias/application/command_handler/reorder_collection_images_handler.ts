import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { ReorderCollectionImagesCommand } from '#kernel/medias/application/command/reorder_collection_images_command'
import { CollectionItemRepository } from '#kernel/medias/domain/collection_item_repository'
import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { MediaCollectionNotFoundError } from '#kernel/medias/domain/errors/media_collection_not_found_error'

export class ReorderCollectionImagesHandler implements CommandHandler<
  ReorderCollectionImagesCommand,
  void
> {
  constructor(
    private readonly collectionRepository: MediaCollectionRepository,
    private readonly collectionItemRepository: CollectionItemRepository
  ) {}

  async handle(command: ReorderCollectionImagesCommand): Promise<void> {
    const collection = await this.collectionRepository.findById(command.collectionId)

    if (!collection) {
      throw new MediaCollectionNotFoundError(command.collectionId)
    }

    await this.collectionItemRepository.reorder(command.collectionId, command.imageOrders)
  }
}
