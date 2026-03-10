import { Command } from '#shared/application/use-cases/command'
import { ProductPackItemInput } from '#kernel/product/application/command/create_product_pack_command'

export class UpdateProductPackCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly packId: string,
    public designation: string,
    public price: number,
    public items: ProductPackItemInput[],
    public readonly description?: string,
    public readonly mainImageId?: string,
    public readonly lowStockThreshold?: number
  ) {
    this.timestamp = new Date()
  }
}
