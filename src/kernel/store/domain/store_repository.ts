import { Store } from '#kernel/store/domain/store'
import { RepositoryInterface } from '#shared/infrastructure/repository_interface'

export interface StoreRepository extends RepositoryInterface {
  save(entity: Store): Promise<void>
  findById(id: any): Promise<Store>
}
