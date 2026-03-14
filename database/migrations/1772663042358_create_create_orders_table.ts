import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.string('order_number', 50).unique().notNullable()

      table
        .uuid('customer_id')
        .references('id')
        .inTable('customers')
        .onDelete('SET NULL')
        .nullable()

      table.string('status', 20).notNullable().defaultTo('PENDING')

      // Shipping Address (snapshot at order time)
      table.string('shipping_first_name', 100).notNullable()
      table.string('shipping_last_name', 100).notNullable()
      table.string('shipping_phone', 20).nullable()
      table.string('shipping_address_line1', 255).notNullable()
      table.string('shipping_address_line2', 255).nullable()
      table.string('shipping_city', 100).notNullable()
      table.string('shipping_state', 100).nullable()
      table.string('shipping_postal_code', 20).nullable()
      table.string('shipping_country', 100).notNullable()

      // Pricing
      table.double('subtotal').notNullable().unsigned()
      table.double('shipping_fee').notNullable().unsigned().defaultTo(0)
      table.double('total').notNullable().unsigned()

      // Notes
      table.text('customer_notes').nullable()
      table.text('admin_notes').nullable()

      // Status timestamps
      table.timestamp('confirmed_at').nullable()
      table.timestamp('shipped_at').nullable()
      table.timestamp('delivered_at').nullable()
      table.timestamp('cancelled_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
