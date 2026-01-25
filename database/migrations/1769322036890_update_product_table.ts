import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('picture_url').notNullable().unique().alter()
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.string('picture_url').nullable().alter()
    })
  }
}
