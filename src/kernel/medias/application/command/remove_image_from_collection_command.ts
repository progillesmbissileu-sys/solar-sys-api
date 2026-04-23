import { Command } from '#shared/application/use-cases/command'

export class RemoveImageFromCollectionCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly collectionId: string,
    public readonly imageId: string
  ) {
    this.timestamp = new Date()
  }
}
