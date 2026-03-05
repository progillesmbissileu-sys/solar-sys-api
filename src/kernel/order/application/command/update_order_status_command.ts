import { Command } from '#shared/application/use-cases/command'
import { OrderStatus } from '#kernel/order/domain/type/order_status'

export class UpdateOrderStatusCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly orderId: string,
    public readonly status: OrderStatus,
    public readonly adminNotes?: string
  ) {
    this.timestamp = new Date()
  }
}
