import { RepositoryInterface } from '#shared/domain/repository_interface'
import { ProductCategory } from '../entity/product_category'

export interface ProductCategoryRepository extends RepositoryInterface {
  save(entity: ProductCategory): Promise<void>
  findById(id: any): Promise<ProductCategory>
}
