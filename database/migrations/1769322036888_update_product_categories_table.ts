import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_categories'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('created_at').notNullable().alter()
      table.timestamp('updated_at').notNullable().alter()
    })
  }

  async down() {}
}
