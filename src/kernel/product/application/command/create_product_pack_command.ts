import { Command } from '#shared/application/use-cases/command'

export interface ProductPackItemInput {
  productId: string
  quantity: number
}

export class CreateProductPackCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public price: number,
    public items: ProductPackItemInput[],
    public readonly description?: string,
    public readonly mainImageId?: string,
    public readonly stockQuantity?: number | null,
    public readonly lowStockThreshold?: number
  ) {
    this.timestamp = new Date()
  }
}
