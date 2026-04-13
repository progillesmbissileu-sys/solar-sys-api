import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_modifier_group_product'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE').notNullable()

      table.uuid('modifier_group_id').references('id').inTable('product_modifier_groups').onDelete('CASCADE').notNullable()

      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Composite primary key
      table.primary(['product_id', 'modifier_group_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
