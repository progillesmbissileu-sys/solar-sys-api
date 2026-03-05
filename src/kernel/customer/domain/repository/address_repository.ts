import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Address } from '../entity/address'

export interface AddressRepository extends RepositoryInterface {
  save(entity: Address): Promise<void>
  findById(id: string): Promise<Address>
  findByCustomerId(customerId: string): Promise<Address[]>
  delete(id: string): Promise<void>
}
