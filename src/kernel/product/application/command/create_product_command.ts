import { Command } from '#shared/application/use-cases/command'

export class CreateProductCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public readonly mainImageId: any,
    public readonly categoryId: any,
    public readonly description: string,
    public readonly price: number,
    public readonly brand?: string,
    public readonly imageIds: string[] = []
  ) {
    this.timestamp = new Date()
  }
}
