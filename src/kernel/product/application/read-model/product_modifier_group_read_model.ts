import { ProductModifierGroupDetailsDto } from '#kernel/product/application/dto/product_modifier_read_dto'

export interface ProductModifierGroupReadModel {
  getById(id: string): Promise<ProductModifierGroupDetailsDto | null>
}
