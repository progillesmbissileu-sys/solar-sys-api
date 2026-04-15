import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductModifier } from '#kernel/product/domain/entity/product_modifier'
import { AppId } from '#shared/domain/app_id'

export interface ProductModifierRepository extends RepositoryInterface {
  save(entity: ProductModifier): Promise<void>
  find(id: AppId): Promise<ProductModifier>
  findByGroup(modifierGroupId: AppId): Promise<ProductModifier[]>
  delete(id: AppId): Promise<void>
}
