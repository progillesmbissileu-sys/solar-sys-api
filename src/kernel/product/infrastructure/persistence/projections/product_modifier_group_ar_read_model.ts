import ProductModifierGroup from '#database/active-records/product_modifier_group'
import { ProductModifierGroupReadModel } from '#kernel/product/application/read-model/product_modifier_group_read_model'
import {
  ProductModifierGroupDetailsDto,
  ProductModifierListItemDto,
} from '#kernel/product/application/dto/product_modifier_read_dto'

export class ProductModifierGroupARReadModel implements ProductModifierGroupReadModel {
  async getById(id: string): Promise<ProductModifierGroupDetailsDto | null> {
    const group = await ProductModifierGroup.query()
      .where('id', id)
      .preload('modifiers', (query) => query.orderBy('sort_index', 'asc'))
      .first()

    if (!group) {
      return null
    }

    const modifiers: ProductModifierListItemDto[] = (group.modifiers || []).map((modifier) => ({
      id: modifier.id,
      designation: modifier.designation,
      modifierGroupId: modifier.modifierGroupId,
      priceAdjustment: modifier.priceAdjustment,
      adjustmentType: modifier.adjustmentType as 'fixed' | 'percentage',
      available: modifier.available,
      sortIndex: modifier.sortIndex,
      createdAt: modifier.createdAt,
      updatedAt: modifier.updatedAt,
    }))

    return {
      id: group.id,
      designation: group.designation,
      minSelections: group.minSelections,
      maxSelections: group.maxSelections,
      selectionType: group.selectionType as 'single' | 'multiple',
      required: group.required,
      available: group.available,
      sortIndex: group.sortIndex,
      modifiers,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    }
  }
}
