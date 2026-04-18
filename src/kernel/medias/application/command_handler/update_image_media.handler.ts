import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateImageMediaCommand } from '#kernel/medias/application/command/update_image_media_command'
import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { ImageMedia } from '#kernel/medias/domain/image_media'
import { AppId } from '#shared/domain/app_id'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'

export class UpdateImageMediaHandler implements CommandHandler<UpdateImageMediaCommand, void> {
  constructor(private readonly repository: ImageMediaRepository) {}

  async handle(command: UpdateImageMediaCommand): Promise<void> {
    const existing = await this.repository.findById(command.id)

    if (!existing) {
      throw new ImageNotFoundError(command.id)
    }

    await this.repository.save(
      new ImageMedia(
        AppId.fromString(command.id),
        command.title ?? existing.getTitle(),
        command.url ?? existing.getUrl(),
        command.altDescription ?? existing.getAltDescription(),
        existing.getMetadata(),
        existing.getCreatedAt(),
        null,
        existing.getRelativeKey()
      )
    )
  }
}
