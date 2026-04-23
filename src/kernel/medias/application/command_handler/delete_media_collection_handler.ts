import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteMediaCollectionCommand } from '#kernel/medias/application/command/delete_media_collection_command'
import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { CollectionItemRepository } from '#kernel/medias/domain/collection_item_repository'
import { MediaCollectionNotFoundError } from '#kernel/medias/domain/errors/media_collection_not_found_error'

export class DeleteMediaCollectionHandler implements CommandHandler<
  DeleteMediaCollectionCommand,
  void
> {
  constructor(
    private readonly repository: MediaCollectionRepository,
    private readonly collectionItemRepository: CollectionItemRepository
  ) {}

  async handle(command: DeleteMediaCollectionCommand): Promise<void> {
    const collection = await this.repository.findById(command.id.value)

    if (!collection) {
      throw new MediaCollectionNotFoundError(command.id.value)
    }

    await this.collectionItemRepository.deleteByCollection(command.id.value)
    await this.repository.delete(command.id.value)
  }
}
