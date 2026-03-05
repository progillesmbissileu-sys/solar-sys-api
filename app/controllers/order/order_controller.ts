import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { CreateOrderCommand } from '#kernel/order/application/command/create_order_command'
import { UpdateOrderStatusCommand } from '#kernel/order/application/command/update_order_status_command'
import { CancelOrderCommand } from '#kernel/order/application/command/cancel_order_command'
import type { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { OrderStatus } from '#kernel/order/domain/type/order_status'
import {
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
} from '#validators/order_validator'

@inject()
export default class OrderController {
  constructor(
    private commandBus: CommandBus,
    private orderRepository: OrderRepository
  ) {}

  /**
   * list all orders (with optional status filter)
   */
  async index({ request, response }: HttpContext) {
    const status = request.input('status') as OrderStatus | undefined

    let orders
    if (status) {
      const result = await this.orderRepository.findByStatus(status)
      orders = result.data
    } else {
      orders = await this.orderRepository.findAll()
    }

    return response.ok({
      status: 'success',
      data: orders.map((o: any) => this.serializeOrder(o)),
    })
  }

  /**
   * Get a single order by ID
   */
  async show({ params, response }: HttpContext) {
    const order = await this.orderRepository.findById(params.id)
    return response.ok({
      status: 'success',
      data: this.serializeOrder(order),
    })
  }

  /**
   * Get order by order number
   */
  async findByOrderNumber({ params, response }: HttpContext) {
    const order = await this.orderRepository.findByOrderNumber(params.orderNumber)
    if (!order) {
      return response.notFound({ status: 'error', message: 'Order not found' })
    }
    return response.ok({
      status: 'success',
      data: this.serializeOrder(order),
    })
  }

  /**
   * Create a new order
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrderSchema)

    const command = new CreateOrderCommand(
      payload.customer_id,
      payload.items.map((item: { product_id: string; quantity: number }) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
      payload.shipping_address_id,
      payload.customer_notes || undefined
    )

    const orderNumber = await this.commandBus.execute(command)

    return response.created({
      status: 'success',
      message: 'Order created successfully',
      data: { order_number: orderNumber },
    })
  }

  /**
   * Update order status (admin only)
   */
  async updateStatus({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateOrderStatusSchema)

    const command = new UpdateOrderStatusCommand(
      params.id,
      payload.status as OrderStatus,
      payload.admin_notes || undefined
    )

    await this.commandBus.execute(command)

    return response.ok({
      status: 'success',
      message: 'Order status updated successfully',
    })
  }

  /**
   * Cancel an order
   */
  async cancel({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(cancelOrderSchema)

    const command = new CancelOrderCommand(params.id, payload.reason || undefined)

    await this.commandBus.execute(command)

    return response.ok({
      status: 'success',
      message: 'Order cancelled successfully',
    })
  }

  /**
   * Get orders by customer
   */
  async byCustomer({ params, response }: HttpContext) {
    const result = await this.orderRepository.findByCustomerId(params.customerId)
    return response.ok({
      status: 'success',
      data: result.data.map((o: any) => this.serializeOrder(o)),
      meta: result.meta,
    })
  }

  private serializeOrder(order: any) {
    return {
      id: order.getId(),
      order_number: order.getOrderNumber(),
      customer_id: order.getCustomerId(),
      status: order.getStatus(),
      customer_first_name: order.getCustomerFirstName(),
      customer_last_name: order.getCustomerLastName(),
      customer_phone: order.getCustomerPhone(),
      shipping_address_line1: order.getShippingAddressLine1(),
      shipping_address_line2: order.getShippingAddressLine2(),
      shipping_city: order.getShippingCity(),
      shipping_state: order.getShippingState(),
      shipping_postal_code: order.getShippingPostalCode(),
      shipping_country: order.getShippingCountry(),
      subtotal: order.getSubtotal(),
      shipping_fee: order.getShippingFee(),
      total: order.getTotal(),
      customer_notes: order.getCustomerNotes(),
      admin_notes: order.getAdminNotes(),
      confirmed_at: order.getConfirmedAt(),
      shipped_at: order.getShippedAt(),
      delivered_at: order.getDeliveredAt(),
      cancelled_at: order.getCancelledAt(),
      created_at: order.getCreatedAt(),
      updated_at: order.getUpdatedAt(),
      items: order.getItems()?.map((item: any) => ({
        id: item.getId(),
        product_id: item.getProductId(),
        product_name: item.getProductName(),
        product_slug: item.getProductSlug(),
        quantity: item.getQuantity(),
        unit_price: item.getUnitPrice(),
        total_price: item.getTotalPrice(),
      })),
    }
  }
}
