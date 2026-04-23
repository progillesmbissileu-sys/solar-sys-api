import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import crypto from 'node:crypto'
import MediaCollection from '#database/active-records/media_collection'
import ImageMedia from '#database/active-records/image_media'

export default class CollectionImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column({ columnName: 'collection_id' })
  declare collectionId: crypto.UUID

  @column({ columnName: 'image_id' })
  declare imageId: crypto.UUID

  @column({ columnName: 'sort_order' })
  declare sortOrder: number

  @belongsTo(() => MediaCollection, {
    foreignKey: 'collectionId',
  })
  declare collection: BelongsTo<typeof MediaCollection>

  @belongsTo(() => ImageMedia, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof ImageMedia>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreate(collectionImage: CollectionImage) {
    collectionImage.id = crypto.randomUUID()
  }
}
