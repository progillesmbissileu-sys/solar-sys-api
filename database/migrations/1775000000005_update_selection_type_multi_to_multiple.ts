import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_modifier_groups'

  async up() {
    // Drop the old CHECK constraint first
    await this.db.rawQuery(`
      ALTER TABLE product_modifier_groups
      DROP CONSTRAINT product_modifier_groups_selection_type_check
    `)

    // Update existing rows from 'multi' to 'multiple'
    await this.db.rawQuery(`
      UPDATE product_modifier_groups
      SET selection_type = 'multiple'
      WHERE selection_type = 'multi'
    `)

    // Add the new CHECK constraint with updated enum values
    await this.db.rawQuery(`
      ALTER TABLE product_modifier_groups
      ADD CONSTRAINT product_modifier_groups_selection_type_check
      CHECK (selection_type IN ('single', 'multiple'))
    `)
  }

  async down() {
    // Drop the new CHECK constraint first
    await this.db.rawQuery(`
      ALTER TABLE product_modifier_groups
      DROP CONSTRAINT product_modifier_groups_selection_type_check
    `)

    // Revert existing rows from 'multiple' back to 'multi'
    await this.db.rawQuery(`
      UPDATE product_modifier_groups
      SET selection_type = 'multi'
      WHERE selection_type = 'multiple'
    `)

    // Re-add the old CHECK constraint with original enum values
    await this.db.rawQuery(`
      ALTER TABLE product_modifier_groups
      ADD CONSTRAINT product_modifier_groups_selection_type_check
      CHECK (selection_type IN ('single', 'multi'))
    `)
  }
}
