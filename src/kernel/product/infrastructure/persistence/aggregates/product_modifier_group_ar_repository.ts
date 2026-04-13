import { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import { default as EntityActiveRecord } from '#database/active-records/product_modifier_group'
import ProductModifierActiveRecord from '#database/active-records/product_modifier'
import { ProductModifierGroup } from '#kernel/product/domain/entity/product_modifier_group'
import { ProductModifier } from '#kernel/product/domain/entity/product_modifier'
import { SelectionType } from '#kernel/product/domain/type/selection_type'
import { AdjustmentType } from '#kernel/product/domain/type/adjustment_type'
import { errors } from '@adonisjs/lucid'
import { ProductModifierGroupNotFoundError } from '#kernel/product/application/errors/product_modifier_group_not_found_error'
import { AppId } from '#shared/domain/app_id'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export class ProductModifierGroupARRepository implements ProductModifierGroupRepository {
  async find(id: AppId): Promise<ProductModifierGroup> {
    let groupAR: EntityActiveRecord

    try {
      groupAR = await EntityActiveRecord.query()
        .where('id', id.value)
        .preload('modifiers', (query) => query.orderBy('sort_order', 'asc'))
        .firstOrFail()
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        throw new ProductModifierGroupNotFoundError(String(id), error)
      }

      throw error
    }

    return this.mapToDomainEntity(groupAR)
  }

  async findByIds(ids: AppId[]): Promise<ProductModifierGroup[]> {
    if (ids.length === 0) {
      return []
    }

    const groups = await EntityActiveRecord.query()
      .whereIn(
        'id',
        ids.map((id) => id.value)
      )
      .preload('modifiers', (query) => query.orderBy('sort_order', 'asc'))

    return groups.map((group) => this.mapToDomainEntity(group))
  }

  async save(entity: ProductModifierGroup): Promise<void> {
    const object = {
      id: entity.getId()?.value,
      designation: entity.getDesignation(),
      minSelections: entity.getMinSelections(),
      maxSelections: entity.getMaxSelections(),
      selectionType: entity.getSelectionType(),
      required: entity.isRequired(),
      available: entity.isAvailable(),
      sortOrder: entity.getSortOrder(),
    }

    const trx = await db.transaction()

    try {
      let groupRecord: EntityActiveRecord

      if (entity.getId()) {
        groupRecord = await EntityActiveRecord.updateOrCreate(
          { id: entity.getId()!.value },
          object,
          { client: trx }
        )
      } else {
        groupRecord = await EntityActiveRecord.create(object, { client: trx })
        entity.setId(AppId.fromString(groupRecord.id))
      }

      // Handle modifiers
      const modifiers = entity.getModifiers()
      if (modifiers.length > 0) {
        // Delete existing modifiers
        await ProductModifierActiveRecord.query({ client: trx })
          .where('modifier_group_id', groupRecord.id)
          .delete()

        // Insert new modifiers
        for (const modifier of modifiers) {
          await ProductModifierActiveRecord.create(
            {
              modifierGroupId: groupRecord.id,
              designation: modifier.getDesignation(),
              priceAdjustment: modifier.getPriceAdjustment(),
              adjustmentType: modifier.getAdjustmentType(),
              available: modifier.isAvailable(),
              sortOrder: modifier.getSortOrder(),
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async delete(id: AppId): Promise<void> {
    const trx = await db.transaction()

    try {
      // Delete modifiers first (cascade should handle this, but being explicit)
      await ProductModifierActiveRecord.query({ client: trx })
        .where('modifier_group_id', id.value)
        .delete()

      // Detach from all products
      await db.from('product_modifier_group_product').where('modifier_group_id', id.value).delete()

      // Delete the group
      const group = await EntityActiveRecord.findOrFail(id.value, { client: trx })
      await group.delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async attachToProduct(
    productId: AppId,
    modifierGroupId: AppId,
    sortOrder: number = 0
  ): Promise<void> {
    const trx = await db.transaction()

    try {
      // Check if already attached
      const existing = await db
        .from('product_modifier_group_product')
        .where('product_id', productId.value)
        .where('modifier_group_id', modifierGroupId.value)
        .first()

      if (existing) {
        // Update sort order if already attached
        await db
          .from('product_modifier_group_product')
          .where('product_id', productId.value)
          .where('modifier_group_id', modifierGroupId.value)
          .update({ sort_order: sortOrder, updated_at: DateTime.now().toSQL() })
      } else {
        // Create new attachment
        await db.table('product_modifier_group_product').insert({
          product_id: productId.value,
          modifier_group_id: modifierGroupId.value,
          sort_order: sortOrder,
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        })
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async detachFromProduct(productId: AppId, modifierGroupId: AppId): Promise<void> {
    await db
      .from('product_modifier_group_product')
      .where('product_id', productId.value)
      .where('modifier_group_id', modifierGroupId.value)
      .delete()
  }

  async findByProductId(productId: AppId): Promise<ProductModifierGroup[]> {
    const groups = await EntityActiveRecord.query()
      .join(
        'product_modifier_group_product',
        'product_modifier_groups.id',
        'product_modifier_group_product.modifier_group_id'
      )
      .where('product_modifier_group_product.product_id', productId.value)
      .orderBy('product_modifier_group_product.sort_order', 'asc')
      .preload('modifiers', (query) => query.orderBy('sort_order', 'asc'))

    return groups.map((group) => this.mapToDomainEntity(group))
  }

  private mapToDomainEntity(groupAR: EntityActiveRecord): ProductModifierGroup {
    const modifiers = (groupAR.modifiers || []).map((modifier) => {
      return new ProductModifier(
        modifier.id ? AppId.fromString(modifier.id) : null,
        AppId.fromString(groupAR.id),
        modifier.designation,
        modifier.priceAdjustment,
        modifier.adjustmentType as AdjustmentType,
        modifier.available,
        modifier.sortOrder,
        this.toDate(modifier.createdAt),
        this.toDate(modifier.updatedAt)
      )
    })

    return new ProductModifierGroup(
      AppId.fromString(groupAR.id),
      groupAR.designation,
      groupAR.minSelections,
      groupAR.maxSelections,
      groupAR.selectionType as SelectionType,
      groupAR.required,
      groupAR.available,
      groupAR.sortOrder,
      modifiers,
      this.toDate(groupAR.createdAt),
      this.toDate(groupAR.updatedAt)
    )
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
