import { Command } from '#shared/application/use-cases/command'

export class CreateMediaCollectionCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly name: string,
    public readonly description?: string
  ) {
    this.timestamp = new Date()
  }
}
