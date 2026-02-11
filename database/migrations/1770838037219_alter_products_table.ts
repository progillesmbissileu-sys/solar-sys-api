import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('picture_url')
      table
        .uuid('picture_id')
        .references('id')
        .inTable('image_medias')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  async down() {}
}
