import { Command } from '#shared/application/use-cases/command'

export interface OrderItemInput {
  productId: string
  quantity: number
}

export class CreateOrderCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly customerId: string,
    public readonly items: OrderItemInput[],
    public readonly shippingAddressId: string,
    public readonly customerNotes?: string
  ) {
    this.timestamp = new Date()
  }
}
