import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { AppId } from '#shared/domain/app_id'
import { ProductPackItem } from '../entity/product_pack_item'

export interface ProductPackItemRepository extends RepositoryInterface {
  find(id: AppId): Promise<ProductPackItem | null>
  delete(id: AppId): Promise<void>
}
