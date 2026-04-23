import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateMediaCollectionCommand } from '#kernel/medias/application/command/update_media_collection_command'
import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { MediaCollection } from '#kernel/medias/domain/media_collection'
import { AppId } from '#shared/domain/app_id'
import { MediaCollectionNotFoundError } from '#kernel/medias/domain/errors/media_collection_not_found_error'

export class UpdateMediaCollectionHandler implements CommandHandler<
  UpdateMediaCollectionCommand,
  void
> {
  constructor(private readonly repository: MediaCollectionRepository) {}

  async handle(command: UpdateMediaCollectionCommand): Promise<void> {
    const existing = await this.repository.findById(command.id)

    if (!existing) {
      throw new MediaCollectionNotFoundError(command.id)
    }

    await this.repository.save(
      new MediaCollection(
        AppId.fromString(command.id),
        command.name ?? existing.getName(),
        command.description !== undefined ? command.description : existing.getDescription(),
        existing.getCreatedAt(),
        null
      )
    )
  }
}
