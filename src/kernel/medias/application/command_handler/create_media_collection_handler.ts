import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateMediaCollectionCommand } from '#kernel/medias/application/command/create_media_collection_command'
import { MediaCollectionRepository } from '#kernel/medias/domain/media_collection_repository'
import { MediaCollection } from '#kernel/medias/domain/media_collection'

export class CreateMediaCollectionHandler implements CommandHandler<
  CreateMediaCollectionCommand,
  string
> {
  constructor(private readonly repository: MediaCollectionRepository) {}

  async handle(command: CreateMediaCollectionCommand): Promise<string> {
    const id = (await this.repository.save(
      new MediaCollection(null, command.name, command.description ?? null, null, null)
    )) as string

    return id
  }
}
