import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class UpdateProductPackCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly packId: AppId,
    public designation: string,
    public price: number,
    public items: Array<{ productId: string; quantity: number }>,
    public readonly description?: string,
    public readonly mainImageId?: string,
    public readonly lowStockThreshold?: number
  ) {
    this.timestamp = new Date()
  }
}
