import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ProductModifierGroup from '#database/active-records/product_modifier_group'
import ProductModifier from '#database/active-records/product_modifier'
import Product from '#database/active-records/product'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ProductModifierSeeder extends BaseSeeder {
  public async run() {
    // Get existing products
    const products = await Product.query().limit(3)

    if (products.length === 0) {
      console.log('No products found. Please create products first.')
      return
    }

    // ==========================================
    // 1. SIZE SELECTION GROUP
    // ==========================================
    const sizeGroup = await ProductModifierGroup.create({
      designation: 'Size',
      minSelections: 1,
      maxSelections: 1,
      selectionType: 'single',
      required: true,
      available: true,
      sortOrder: 1,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: sizeGroup.id,
        designation: 'Small',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: sizeGroup.id,
        designation: 'Medium',
        priceAdjustment: 1.5,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 2,
      },
      {
        modifierGroupId: sizeGroup.id,
        designation: 'Large',
        priceAdjustment: 3.0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 3,
      },
    ])

    // ==========================================
    // 2. EXTRA TOPPINGS GROUP
    // ==========================================
    const toppingsGroup = await ProductModifierGroup.create({
      designation: 'Extra Toppings',
      minSelections: 0,
      maxSelections: 5,
      selectionType: 'multiple',
      required: false,
      available: true,
      sortOrder: 2,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: toppingsGroup.id,
        designation: 'Extra Cheese',
        priceAdjustment: 1.0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: toppingsGroup.id,
        designation: 'Bacon',
        priceAdjustment: 2.0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 2,
      },
      {
        modifierGroupId: toppingsGroup.id,
        designation: 'Jalapeños',
        priceAdjustment: 0.75,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 3,
      },
      {
        modifierGroupId: toppingsGroup.id,
        designation: 'Grilled Onions',
        priceAdjustment: 0.5,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 4,
      },
      {
        modifierGroupId: toppingsGroup.id,
        designation: 'Extra Patty',
        priceAdjustment: 3.5,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 5,
      },
    ])

    // ==========================================
    // 3. COOKING PREFERENCE GROUP
    // ==========================================
    const cookingGroup = await ProductModifierGroup.create({
      designation: 'Cooking Preference',
      minSelections: 0,
      maxSelections: 1,
      selectionType: 'single',
      required: false,
      available: true,
      sortOrder: 3,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: cookingGroup.id,
        designation: 'Rare',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: cookingGroup.id,
        designation: 'Medium',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 2,
      },
      {
        modifierGroupId: cookingGroup.id,
        designation: 'Well Done',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 3,
      },
    ])

    // ==========================================
    // 4. REMOVE INGREDIENTS GROUP
    // ==========================================
    const removeGroup = await ProductModifierGroup.create({
      designation: 'Remove Ingredients',
      minSelections: 0,
      maxSelections: null,
      selectionType: 'multiple',
      required: false,
      available: true,
      sortOrder: 4,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: removeGroup.id,
        designation: 'No Pickles',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: removeGroup.id,
        designation: 'No Onions',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 2,
      },
      {
        modifierGroupId: removeGroup.id,
        designation: 'No Tomatoes',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 3,
      },
      {
        modifierGroupId: removeGroup.id,
        designation: 'No Sauce',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 4,
      },
    ])

    // ==========================================
    // 5. CHOOSE YOUR DRINK GROUP
    // ==========================================
    const drinkGroup = await ProductModifierGroup.create({
      designation: 'Choose Your Drink',
      minSelections: 1,
      maxSelections: 1,
      selectionType: 'single',
      required: true,
      available: true,
      sortOrder: 5,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: drinkGroup.id,
        designation: 'Coca-Cola',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: drinkGroup.id,
        designation: 'Sprite',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 2,
      },
      {
        modifierGroupId: drinkGroup.id,
        designation: 'Fanta',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 3,
      },
      {
        modifierGroupId: drinkGroup.id,
        designation: 'Bottled Water',
        priceAdjustment: -0.5,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 4,
      },
    ])

    // ==========================================
    // 6. SAUCE SELECTION GROUP
    // ==========================================
    const sauceGroup = await ProductModifierGroup.create({
      designation: 'Sauce Selection',
      minSelections: 0,
      maxSelections: 3,
      selectionType: 'multiple',
      required: false,
      available: true,
      sortOrder: 6,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: sauceGroup.id,
        designation: 'Ketchup',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: sauceGroup.id,
        designation: 'Mayo',
        priceAdjustment: 0,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 2,
      },
      {
        modifierGroupId: sauceGroup.id,
        designation: 'BBQ Sauce',
        priceAdjustment: 0.25,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 3,
      },
      {
        modifierGroupId: sauceGroup.id,
        designation: 'Special Sauce',
        priceAdjustment: 0.5,
        adjustmentType: 'fixed',
        available: true,
        sortOrder: 4,
      },
    ])

    // ==========================================
    // 7. PREMIUM UPGRADES GROUP (Percentage-based)
    // ==========================================
    const premiumGroup = await ProductModifierGroup.create({
      designation: 'Premium Upgrades',
      minSelections: 0,
      maxSelections: null,
      selectionType: 'multiple',
      required: false,
      available: true,
      sortOrder: 7,
    })

    await ProductModifier.createMany([
      {
        modifierGroupId: premiumGroup.id,
        designation: 'Double Cheese',
        priceAdjustment: 15,
        adjustmentType: 'percentage',
        available: true,
        sortOrder: 1,
      },
      {
        modifierGroupId: premiumGroup.id,
        designation: 'Wagyu Patty Upgrade',
        priceAdjustment: 50,
        adjustmentType: 'percentage',
        available: true,
        sortOrder: 2,
      },
    ])

    // ==========================================
    // ATTACH MODIFIER GROUPS TO PRODUCTS
    // ==========================================
    const now = DateTime.now().toSQL()

    // Attach groups to first product (all groups)
    if (products[0]) {
      const groupsToAttach = [
        { groupId: sizeGroup.id, sortOrder: 1 },
        { groupId: toppingsGroup.id, sortOrder: 2 },
        { groupId: cookingGroup.id, sortOrder: 3 },
        { groupId: removeGroup.id, sortOrder: 4 },
      ]

      for (const item of groupsToAttach) {
        await db.table('product_modifier_group_product').insert({
          product_id: products[0].id,
          modifier_group_id: item.groupId,
          sort_order: item.sortOrder,
          created_at: now,
          updated_at: now,
        })
      }
    }

    // Attach groups to second product (combo-style)
    if (products[1]) {
      const groupsToAttach = [
        { groupId: sizeGroup.id, sortOrder: 1 },
        { groupId: toppingsGroup.id, sortOrder: 2 },
        { groupId: drinkGroup.id, sortOrder: 3 },
        { groupId: sauceGroup.id, sortOrder: 4 },
      ]

      for (const item of groupsToAttach) {
        await db.table('product_modifier_group_product').insert({
          product_id: products[1].id,
          modifier_group_id: item.groupId,
          sort_order: item.sortOrder,
          created_at: now,
          updated_at: now,
        })
      }
    }

    // Attach groups to third product (premium-style)
    if (products[2]) {
      const groupsToAttach = [
        { groupId: sizeGroup.id, sortOrder: 1 },
        { groupId: toppingsGroup.id, sortOrder: 2 },
        { groupId: premiumGroup.id, sortOrder: 3 },
        { groupId: cookingGroup.id, sortOrder: 4 },
      ]

      for (const item of groupsToAttach) {
        await db.table('product_modifier_group_product').insert({
          product_id: products[2].id,
          modifier_group_id: item.groupId,
          sort_order: item.sortOrder,
          created_at: now,
          updated_at: now,
        })
      }
    }

    console.log('✅ Product modifier sample data seeded successfully!')
    console.log(`   Created 7 modifier groups with 27 total modifiers`)
    console.log(`   Attached modifier groups to ${products.length} products`)
  }
}
