import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table
        .uuid('customer_id')
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE')
        .notNullable()

      table.string('type', 20).notNullable() // 'shipping', 'billing'
      table.string('address_line1', 255).notNullable()
      table.string('address_line2', 255).nullable()
      table.string('city', 100).notNullable()
      table.string('state', 100).nullable()
      table.string('postal_code', 20).nullable()
      table.string('country', 100).notNullable()
      table.boolean('is_default').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
