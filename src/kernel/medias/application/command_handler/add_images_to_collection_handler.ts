import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { AddImagesToCollectionCommand } from '#kernel/medias/application/command/add_images_to_collection_command'
import { CollectionItemRepository } from '#kernel/medias/domain/collection_item_repository'
import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { MediaCollectionNotFoundError } from '#kernel/medias/domain/errors/media_collection_not_found_error'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'
import { CollectionItem } from '#kernel/medias/domain/collection_item'

export class AddImagesToCollectionHandler implements CommandHandler<
  AddImagesToCollectionCommand,
  void
> {
  constructor(
    private readonly collectionRepository: MediaCollectionRepository,
    private readonly imageRepository: ImageMediaRepository,
    private readonly collectionItemRepository: CollectionItemRepository
  ) {}

  async handle(command: AddImagesToCollectionCommand): Promise<void> {
    const collection = await this.collectionRepository.findById(command.collectionId)

    if (!collection) {
      throw new MediaCollectionNotFoundError(command.collectionId)
    }

    const existingItems = await this.collectionItemRepository.findByCollection(command.collectionId)
    const existingImageIds = new Set(existingItems.map((item) => item.getImageId()))

    const newItems: CollectionItem[] = []
    const seenImageIds = new Set<string>()

    for (const imageItem of command.images) {
      if (existingImageIds.has(imageItem.imageId) || seenImageIds.has(imageItem.imageId)) {
        continue
      }

      const image = await this.imageRepository.findById(imageItem.imageId)

      if (!image) {
        throw new ImageNotFoundError(imageItem.imageId)
      }

      seenImageIds.add(imageItem.imageId)

      const sortOrder = imageItem.sortOrder ?? existingItems.length + newItems.length

      newItems.push(new CollectionItem(command.collectionId, imageItem.imageId, sortOrder))
    }

    if (newItems.length > 0) {
      await this.collectionItemRepository.saveMany(newItems)
    }
  }
}
