import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'market_services'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .uuid('thumbnail_id')
        .references('id')
        .inTable('image_medias')
        .notNullable()
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('thumbnail_id')
    })
  }
}
