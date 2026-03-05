import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'order_id' })
  declare orderId: crypto.UUID

  @column({ columnName: 'product_id' })
  declare productId: crypto.UUID | null

  @column({ columnName: 'product_name' })
  declare productName: string

  @column({ columnName: 'product_slug' })
  declare productSlug: string | null

  @column()
  declare quantity: number

  @column({ columnName: 'unit_price' })
  declare unitPrice: number

  @column({ columnName: 'total_price' })
  declare totalPrice: number

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static async beforeCreate(orderItem: OrderItem) {
    orderItem.id = crypto.randomUUID()
  }
}
