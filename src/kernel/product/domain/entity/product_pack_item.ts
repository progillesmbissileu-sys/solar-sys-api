import { Product } from '#kernel/product/domain/entity/product'

export class ProductPackItem {
  constructor(
    private productId: string,
    private quantity: number,
    private product?: Product,
    private sortOrder: number = 0
  ) {}

  getProductId(): string {
    return this.productId
  }

  getQuantity(): number {
    return this.quantity
  }

  getProduct(): Product | undefined {
    return this.product
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
