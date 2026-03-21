import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { CustomerAddress } from '#kernel/customer/domain/entity/address'
import { AppId } from '#shared/domain/app_id'

export interface AddressRepository extends RepositoryInterface {
  save(entity: CustomerAddress): Promise<void>
  findById(id: AppId): Promise<CustomerAddress>
  findByCustomerId(customerId: AppId): Promise<CustomerAddress[]>
  delete(id: AppId): Promise<void>
}
