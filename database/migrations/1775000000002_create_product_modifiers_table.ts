import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_modifiers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.uuid('modifier_group_id').references('id').inTable('product_modifier_groups').onDelete('CASCADE').notNullable()

      table.string('designation', 255).notNullable()

      table.double('price_adjustment').notNullable().defaultTo(0)

      table.enum('adjustment_type', ['fixed', 'percentage']).notNullable().defaultTo('fixed')

      table.boolean('available').notNullable().defaultTo(true)

      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
