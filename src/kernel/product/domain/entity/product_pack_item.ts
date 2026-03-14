import { AppId } from '#shared/domain/app_id'

export class ProductPackItem {
  constructor(
    private id: AppId | null,
    private productId: AppId,
    private quantity: number,
    private packId?: AppId,
    private sortOrder: number = 0
  ) {}

  getId(): AppId | null {
    return this.id
  }

  getProductId(): AppId {
    return this.productId
  }

  getQuantity(): number {
    return this.quantity
  }

  getPackId(): AppId | undefined {
    return this.packId
  }

  getSortOrder(): number {
    return this.sortOrder
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity
  }

  setSortOrder(sortOrder: number): void {
    this.sortOrder = sortOrder
  }
}
