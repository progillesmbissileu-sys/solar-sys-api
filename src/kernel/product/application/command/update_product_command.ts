import { Command } from '#shared/application/use-cases/command'

export class UpdateProductCommand implements Command {
  readonly timestamp: Date
  constructor(
    public readonly productId: any,
    public readonly designation: string,
    public readonly pictureId: any,
    public readonly categoryId: any,
    public readonly description: string,
    public readonly price: number,
    public readonly brand?: string,
    public readonly isAvailable?: boolean,
    public readonly isDeleted?: boolean
  ) {
    this.timestamp = new Date()
  }
}
