import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Customer } from '#kernel/customer/domain/entity/customer'

export interface CustomerRepository extends RepositoryInterface {
  save(entity: Customer): Promise<void>
  findById(id: string): Promise<Customer>
  findAll(): Promise<Customer[]>
  findByEmail(email: string): Promise<Customer | null>
  delete(id: string): Promise<void>
}
