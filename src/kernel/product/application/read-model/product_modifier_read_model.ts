import { ProductModifierDetailsDto } from '#kernel/product/application/dto/product_modifier_read_dto'

export interface ProductModifierReadModel {
  getById(id: string): Promise<ProductModifierDetailsDto | null>
}
