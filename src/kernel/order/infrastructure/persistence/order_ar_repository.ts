import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { default as EntityActiveRecord } from '#database/active-records/order'
import OrderItemActiveRecord from '#database/active-records/order_item'
import { Order } from '#kernel/order/domain/entity/order'
import { OrderItem } from '#kernel/order/domain/entity/order_item'
import { OrderStatus } from '#kernel/order/domain/type/order_status'
import db from '@adonisjs/lucid/services/db'

export class OrderARRepository implements OrderRepository {
  async findById(id: string): Promise<Order> {
    const order = await EntityActiveRecord.findOrFail(id)
    return this.mapToEntity(order)
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await EntityActiveRecord.findBy('order_number', orderNumber)
    if (!order) {
      return null
    }
    return this.mapToEntity(order)
  }

  async findByCustomerId(
    customerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }> {
    const result = await EntityActiveRecord.query()
      .where('customer_id', customerId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()
    const orders = await Promise.all(paginatedResult.data.map((order) => this.mapToEntity(order)))

    return {
      data: orders,
      meta: paginatedResult.meta,
    }
  }

  async findByStatus(
    status: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }> {
    const result = await EntityActiveRecord.query()
      .where('status', status)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()
    const orders = await Promise.all(paginatedResult.data.map((order) => this.mapToEntity(order)))

    return {
      data: orders,
      meta: paginatedResult.meta,
    }
  }

  async save(entity: Order): Promise<void> {
    const object = {
      orderNumber: entity.getOrderNumber(),
      customerId: entity.getCustomerId() as any,
      status: entity.getStatus(),
      shippingFirstName: entity.getShippingFirstName(),
      shippingLastName: entity.getShippingLastName(),
      shippingPhone: entity.getShippingPhone(),
      shippingAddressLine1: entity.getShippingAddressLine1(),
      shippingAddressLine2: entity.getShippingAddressLine2(),
      shippingCity: entity.getShippingCity(),
      shippingState: entity.getShippingState(),
      shippingPostalCode: entity.getShippingPostalCode(),
      shippingCountry: entity.getShippingCountry(),
      subtotal: entity.getSubtotal(),
      shippingFee: entity.getShippingFee(),
      total: entity.getTotal(),
      customerNotes: entity.getCustomerNotes(),
      adminNotes: entity.getAdminNotes(),
      confirmedAt: entity.getConfirmedAt() as any,
      shippedAt: entity.getShippedAt() as any,
      deliveredAt: entity.getDeliveredAt() as any,
      cancelledAt: entity.getCancelledAt() as any,
    }

    const trx = await db.transaction()

    try {
      let orderRecord: EntityActiveRecord

      if (entity.getId()) {
        orderRecord = await EntityActiveRecord.updateOrCreate(
          { id: entity.getId() as any },
          object,
          { client: trx }
        )
      } else {
        orderRecord = await EntityActiveRecord.create(object, { client: trx })
      }

      // Save order items
      const items = entity.getItems()
      if (items.length > 0) {
        // Delete existing items
        await OrderItemActiveRecord.query({ client: trx })
          .where('order_id', orderRecord.id)
          .delete()

        // Insert new items
        for (const item of items) {
          await OrderItemActiveRecord.create(
            {
              orderId: orderRecord.id,
              productId: item.getProductId() as any,
              productName: item.getProductName(),
              productSlug: item.getProductSlug(),
              quantity: item.getQuantity(),
              unitPrice: item.getUnitPrice(),
              totalPrice: item.getTotalPrice(),
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    const order = await EntityActiveRecord.findOrFail(id)
    await order.delete()
  }

  async findAll(): Promise<Order[]> {
    const orders = await EntityActiveRecord.all()
    return Promise.all(orders.map((order) => this.mapToEntity(order)))
  }

  private async mapToEntity(order: any): Promise<Order> {
    // Load order items
    const orderItems = await OrderItemActiveRecord.query().where('order_id', order.id)

    const items: OrderItem[] = orderItems.map((item) => {
      return new OrderItem(
        item.id,
        item.orderId,
        item.productId,
        item.productName,
        item.productSlug,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        item.createdAt as any
      )
    })

    return new Order(
      order.id,
      order.orderNumber,
      order.customerId,
      order.status as OrderStatus,
      order.shippingFirstName,
      order.shippingLastName,
      order.shippingPhone,
      order.shippingAddressLine1,
      order.shippingAddressLine2,
      order.shippingCity,
      order.shippingState,
      order.shippingPostalCode,
      order.shippingCountry,
      order.subtotal,
      order.shippingFee,
      order.total,
      order.customerNotes,
      order.adminNotes,
      items,
      order.confirmedAt as any,
      order.shippedAt as any,
      order.deliveredAt as any,
      order.cancelledAt as any,
      order.createdAt as any,
      order.updatedAt as any
    )
  }
}
