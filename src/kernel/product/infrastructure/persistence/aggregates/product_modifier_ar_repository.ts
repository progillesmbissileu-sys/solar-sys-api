import { ProductModifierRepository } from '#kernel/product/domain/repository/product_modifier_repository'
import { default as EntityActiveRecord } from '#database/active-records/product_modifier'
import { ProductModifier } from '#kernel/product/domain/entity/product_modifier'
import { AppId } from '#shared/domain/app_id'
import { errors } from '@adonisjs/lucid'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export class ProductModifierARRepository implements ProductModifierRepository {
  async find(id: AppId): Promise<ProductModifier> {
    let modifierAR: EntityActiveRecord

    try {
      modifierAR = await EntityActiveRecord.query()
        .where('id', id.value)
        .firstOrFail()
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        throw new Error(`ProductModifier with id ${id.value} not found`)
      }
      throw error
    }

    return this.mapToDomainEntity(modifierAR)
  }

  async findByGroup(modifierGroupId: AppId): Promise<ProductModifier[]> {
    const modifiers = await EntityActiveRecord.query()
      .where('modifier_group_id', modifierGroupId.value)
      .orderBy('sort_order', 'asc')

    return modifiers.map((modifier) => this.mapToDomainEntity(modifier))
  }

  async save(entity: ProductModifier): Promise<void> {
    const object = {
      id: entity.getId()?.value,
      modifierGroupId: entity.getModifierGroupId().value,
      designation: entity.getDesignation(),
      priceAdjustment: entity.getPriceAdjustment(),
      adjustmentType: entity.getAdjustmentType(),
      available: entity.isAvailable(),
      sortOrder: entity.getSortOrder(),
    }

    const trx = await db.transaction()

    try {
      if (entity.getId()) {
        await EntityActiveRecord.updateOrCreate({ id: entity.getId()!.value }, object, { client: trx })
      } else {
        const modifierRecord = await EntityActiveRecord.create(object, { client: trx })
        entity.setId(AppId.fromString(modifierRecord.id))
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
      const modifier = await EntityActiveRecord.findOrFail(id.value, { client: trx })
      await modifier.delete()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  private mapToDomainEntity(modifierAR: EntityActiveRecord): ProductModifier {
    return new ProductModifier(
      AppId.fromString(modifierAR.id),
      AppId.fromString(modifierAR.modifierGroupId),
      modifierAR.designation,
      modifierAR.priceAdjustment,
      modifierAR.adjustmentType as 'fixed' | 'percentage',
      modifierAR.available,
      modifierAR.sortOrder,
      this.toDate(modifierAR.createdAt),
      this.toDate(modifierAR.updatedAt)
    )
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
