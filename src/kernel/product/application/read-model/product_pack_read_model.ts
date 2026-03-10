import { ProductPackDetailsDto } from '#kernel/product/application/dto/product_pack_read_dto'

export interface ProductPackReadModel {
  getById(packId: string): Promise<ProductPackDetailsDto | null>
  getBySlug(slug: string): Promise<ProductPackDetailsDto | null>
}
