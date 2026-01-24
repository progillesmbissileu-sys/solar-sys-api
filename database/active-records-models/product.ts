import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'
import ProductCategory from '#database/active-records-models/product_category'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'category_id' })
  declare categoryId: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'product_slug' })
  declare slug: string

  @column()
  declare description: string

  @column({ columnName: 'picture_url' })
  declare pictureUrl: string

  @column()
  declare price: number

  @column()
  declare brand: string

  @column({ columnName: 'is_available' })
  declare isAvailable: boolean

  @column({ columnName: 'is_deleted' })
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => ProductCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof ProductCategory>

  @beforeCreate()
  static async beforeCreate(product: Product) {
    product.id = crypto.randomUUID()
  }
}
