import { Command } from '#shared/application/use-cases/command'

export class RemoveProductImageCommand implements Command {
  readonly timestamp: Date
  constructor(
    public readonly productId: string,
    public readonly imageId: string
  ) {
    this.timestamp = new Date()
  }
}
