import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_modifier_groups'

  async up() {
    // Rename duplicate designations by appending a counter suffix (e.g. "Designation 1", "Designation 2", ...)
    await this.db.rawQuery(`
      UPDATE product_modifier_groups
      SET designation = product_modifier_groups.designation || ' ' || ranked.rn::text
      FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY designation ORDER BY created_at ASC) AS rn
        FROM product_modifier_groups
        WHERE designation IN (
          SELECT designation
          FROM product_modifier_groups
          GROUP BY designation
          HAVING COUNT(*) > 1
        )
      ) ranked
      WHERE product_modifier_groups.id = ranked.id
        AND ranked.rn > 1
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['designation'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['designation'])
    })
  }
}
