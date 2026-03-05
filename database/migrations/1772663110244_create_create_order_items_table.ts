import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE').notNullable()

      table.uuid('product_id').references('id').inTable('products').onDelete('SET NULL').nullable()

      table.string('product_name', 255).notNullable()
      table.string('product_slug', 255).nullable()

      table.integer('quantity').notNullable()
      table.double('unit_price').notNullable().unsigned()
      table.double('total_price').notNullable().unsigned()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
