import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collection_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('collection_id')
        .notNullable()
        .references('id')
        .inTable('media_collections')
        .onDelete('CASCADE')
      table
        .uuid('image_id')
        .notNullable()
        .references('id')
        .inTable('image_medias')
        .onDelete('CASCADE')
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['collection_id', 'image_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
