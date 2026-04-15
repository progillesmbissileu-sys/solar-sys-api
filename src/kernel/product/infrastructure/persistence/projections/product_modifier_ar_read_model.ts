import ProductModifier from '#database/active-records/product_modifier'
import { ProductModifierReadModel } from '#kernel/product/application/read-model/product_modifier_read_model'
import { ProductModifierDetailsDto } from '#kernel/product/application/dto/product_modifier_read_dto'

export class ProductModifierARReadModel implements ProductModifierReadModel {
  async getById(id: string): Promise<ProductModifierDetailsDto | null> {
    const modifier = await ProductModifier.query()
      .where('id', id)
      .first()

    if (!modifier) {
      return null
    }

    return {
      id: modifier.id,
      designation: modifier.designation,
      modifierGroupId: modifier.modifierGroupId,
      priceAdjustment: modifier.priceAdjustment,
      adjustmentType: modifier.adjustmentType as 'fixed' | 'percentage',
      available: modifier.available,
      sortIndex: modifier.sortIndex,
      createdAt: modifier.createdAt,
      updatedAt: modifier.updatedAt,
    }
  }
}
