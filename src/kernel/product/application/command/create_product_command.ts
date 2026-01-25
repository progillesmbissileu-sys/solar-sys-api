import { Command } from '#shared/application/use-cases/command'

export class CreateProductCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public readonly categoryId: any,
    public readonly description: string,
    public readonly pictureUrl: string,
    public readonly price: number,
    public readonly brand?: string
  ) {
    this.timestamp = new Date()
  }
}
