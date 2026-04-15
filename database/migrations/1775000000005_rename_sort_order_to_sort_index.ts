import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Rename sort_order to sort_index in product_modifier_groups
    this.schema.alterTable('product_modifier_groups', (table) => {
      table.renameColumn('sort_order', 'sort_index')
    })

    // Rename sort_order to sort_index in product_modifiers
    this.schema.alterTable('product_modifiers', (table) => {
      table.renameColumn('sort_order', 'sort_index')
    })

    // Rename sort_order to sort_index in product_modifier_group_product
    this.schema.alterTable('product_modifier_group_product', (table) => {
      table.renameColumn('sort_order', 'sort_index')
    })
  }

  async down() {
    // Revert sort_index to sort_order in product_modifier_groups
    this.schema.alterTable('product_modifier_groups', (table) => {
      table.renameColumn('sort_index', 'sort_order')
    })

    // Revert sort_index to sort_order in product_modifiers
    this.schema.alterTable('product_modifiers', (table) => {
      table.renameColumn('sort_index', 'sort_order')
    })

    // Revert sort_index to sort_order in product_modifier_group_product
    this.schema.alterTable('product_modifier_group_product', (table) => {
      table.renameColumn('sort_index', 'sort_order')
    })
  }
}
