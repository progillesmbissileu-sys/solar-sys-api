import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'

export interface ProductPackRepository extends RepositoryInterface {
  save(entity: ProductPack): Promise<void>
  find(id: any): Promise<ProductPack>
  delete(id: any): Promise<void>
}
