import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_pack_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table
        .uuid('pack_id')
        .references('id')
        .inTable('product_packs')
        .onDelete('CASCADE')
        .notNullable()

      table
        .uuid('product_id')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('quantity').notNullable().defaultTo(1)
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at')

      // Unique constraint to prevent duplicate products in a pack
      table.unique(['pack_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
