import { Command } from '#shared/application/use-cases/command'

export class AddProductImageCommand implements Command {
  readonly timestamp: Date
  constructor(
    public readonly productId: string,
    public readonly imageId: string,
    public readonly isMainImage: boolean
  ) {
    this.timestamp = new Date()
  }
}
