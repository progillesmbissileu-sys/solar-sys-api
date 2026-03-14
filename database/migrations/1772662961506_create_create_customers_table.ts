import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().notNullable()

      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL').nullable()

      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('phone', 20).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
