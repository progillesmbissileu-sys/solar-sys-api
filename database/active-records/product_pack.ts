import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import ImageMedia from '#database/active-records/image_media'
import Product from '#database/active-records/product'
import ProductPackItem from '#database/active-records/product_pack_item'

export default class ProductPack extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'pack_slug' })
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column({ columnName: 'main_image_id' })
  declare mainImageId: crypto.UUID | null

  @column({ columnName: 'stock_quantity' })
  declare stockQuantity: number | null

  @column({ columnName: 'low_stock_threshold' })
  declare lowStockThreshold: number

  @column({ columnName: 'is_available' })
  declare isAvailable: boolean

  @column({ columnName: 'is_deleted' })
  declare isDeleted: boolean

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => ImageMedia, {
    foreignKey: 'mainImageId',
  })
  declare mainImage: BelongsTo<typeof ImageMedia>

  @hasMany(() => ProductPackItem, {
    foreignKey: 'packId',
  })
  declare packItems: HasMany<typeof ProductPackItem>

  @manyToMany(() => Product, {
    pivotTable: 'product_pack_items',
    localKey: 'id',
    pivotForeignKey: 'pack_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
    pivotColumns: ['quantity', 'sort_order'],
    serializeAs: 'products',
    pivotTimestamps: true,
  })
  declare products: ManyToMany<typeof Product>

  @beforeCreate()
  static async beforeCreate(pack: ProductPack) {
    pack.id = crypto.randomUUID()
  }
}
