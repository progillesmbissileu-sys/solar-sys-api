import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import ProductModifierGroup from '#database/active-records/product_modifier_group'

export default class ProductModifier extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'modifier_group_id' })
  declare modifierGroupId: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'price_adjustment' })
  declare priceAdjustment: number

  @column({ columnName: 'adjustment_type' })
  declare adjustmentType: 'fixed' | 'percentage'

  @column()
  declare available: boolean

  @column({ columnName: 'sort_index' })
  declare sortIndex: number

  // @ts-ignore
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // @ts-ignore
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => ProductModifierGroup, {
    foreignKey: 'modifierGroupId',
  })
  declare modifierGroup: BelongsTo<typeof ProductModifierGroup>

  @beforeCreate()
  static async beforeCreate(modifier: ProductModifier) {
    modifier.id = crypto.randomUUID()
  }
}
