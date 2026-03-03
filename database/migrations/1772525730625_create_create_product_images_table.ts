import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_images'

  async up() {
    // First, rename picture_id to main_image_id in products table
    this.schema.alterTable('products', (table) => {
      table.renameColumn('picture_id', 'main_image_id')
    })

    // Create junction table for additional product images (max 2)
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('product_id')
        .notNullable()
        .references('id')
        .inTable('products')
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

      // Ensure unique combination of product and image
      table.unique(['product_id', 'image_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.alterTable('products', (table) => {
      table.renameColumn('main_image_id', 'picture_id')
    })
  }
}
