import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Product } from '../entity/product'

export interface ProductRepository extends RepositoryInterface {
  save(entity: Product, imageIds?: string[]): Promise<void>
  findById(id: any): Promise<Product>
  delete(id: any): Promise<void>
}
