import { Command } from '#shared/application/use-cases/command'

export class UpdateProductCommand implements Command {
  readonly timestamp: Date
  constructor(
    public readonly productId: any,
    public readonly designation: string,
    public readonly mainImageId: any,
    public readonly categoryId: any,
    public readonly description: string,
    public readonly price: number,
    public readonly brand?: string,
    public readonly isAvailable?: boolean,
    public readonly isDeleted?: boolean,
    public readonly imageIds: string[] = []
  ) {
    this.timestamp = new Date()
  }
}
