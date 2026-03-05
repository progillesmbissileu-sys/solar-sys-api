export class OrderItem {
  constructor(
    private id: string | null,
    private orderId: string,
    private productId: string | null,
    private productName: string,
    private productSlug: string | null,
    private quantity: number,
    private unitPrice: number,
    private totalPrice: number,
    private createdAt?: Date
  ) {}

  getId(): string | null {
    return this.id
  }

  getOrderId(): string {
    return this.orderId
  }

  getProductId(): string | null {
    return this.productId
  }

  getProductName(): string {
    return this.productName
  }

  getProductSlug(): string | null {
    return this.productSlug
  }

  getQuantity(): number {
    return this.quantity
  }

  getUnitPrice(): number {
    return this.unitPrice
  }

  getTotalPrice(): number {
    return this.totalPrice
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }
}
