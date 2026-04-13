import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductModifierGroup } from '#kernel/product/domain/entity/product_modifier_group'
import { AppId } from '#shared/domain/app_id'

export interface ProductModifierGroupRepository extends RepositoryInterface {
  save(entity: ProductModifierGroup): Promise<void>
  find(id: AppId): Promise<ProductModifierGroup>
  findByIds(ids: AppId[]): Promise<ProductModifierGroup[]>
  delete(id: AppId): Promise<void>
  attachToProduct(productId: AppId, modifierGroupId: AppId, sortOrder?: number): Promise<void>
  detachFromProduct(productId: AppId, modifierGroupId: AppId): Promise<void>
  findByProductId(productId: AppId): Promise<ProductModifierGroup[]>
}
