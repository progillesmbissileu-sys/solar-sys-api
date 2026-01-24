import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import crypto from 'node:crypto'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare designation: string

  @column({ columnName: 'category_slug' })
  declare slug: string

  @column({ columnName: 'category_type' })
  declare type: 'CATEGORY' | 'TAG'

  @column()
  declare parentId: crypto.UUID

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
