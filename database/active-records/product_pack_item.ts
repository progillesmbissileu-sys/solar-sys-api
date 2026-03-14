import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import ProductPack from '#database/active-records/product_pack'
import Product from '#database/active-records/product'

export default class ProductPackItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'pack_id' })
  declare packId: crypto.UUID

  @column({ columnName: 'product_id' })
  declare productId: crypto.UUID

  @column()
  declare quantity: number

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  @belongsTo(() => ProductPack, {
    foreignKey: 'packId',
  })
  declare pack: BelongsTo<typeof ProductPack>

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare product: BelongsTo<typeof Product>

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static async beforeCreate(item: ProductPackItem) {
    item.id = crypto.randomUUID()
  }
}
