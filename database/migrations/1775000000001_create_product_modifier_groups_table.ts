import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_modifier_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.string('designation', 255).notNullable()

      table.integer('min_selections').defaultTo(0).notNullable()
      table.integer('max_selections').nullable() // null means unlimited

      table.enum('selection_type', ['single', 'multi']).defaultTo('multi').notNullable()

      table.boolean('required').defaultTo(false).notNullable()
      table.boolean('available').defaultTo(true).notNullable()

      table.integer('sort_order').defaultTo(0).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
