import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import Product from '#database/active-records/product'
import ProductModifier from '#database/active-records/product_modifier'

export default class ProductModifierGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'min_selections' })
  declare minSelections: number

  @column({ columnName: 'max_selections' })
  declare maxSelections: number | null

  @column({ columnName: 'selection_type' })
  declare selectionType: 'single' | 'multi'

  @column()
  declare required: boolean

  @column()
  declare available: boolean

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ProductModifier, {
    foreignKey: 'modifierGroupId',
  })
  declare modifiers: HasMany<typeof ProductModifier>

  @manyToMany(() => Product, {
    pivotTable: 'product_modifier_group_product',
    localKey: 'id',
    pivotForeignKey: 'modifier_group_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
    pivotColumns: ['sort_order'],
    serializeAs: 'products',
    pivotTimestamps: true,
  })
  declare products: ManyToMany<typeof Product>

  @beforeCreate()
  static async beforeCreate(modifierGroup: ProductModifierGroup) {
    modifierGroup.id = crypto.randomUUID()
  }
}
