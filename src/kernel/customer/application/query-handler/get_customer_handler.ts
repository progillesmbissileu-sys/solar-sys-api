import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetCustomerQuery } from '../query/get_customer_query'
import { Customer } from '#kernel/customer/domain/entity/customer'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { CustomerDTO } from './list_customers_handler'

export class GetCustomerHandler implements QueryHandler<GetCustomerQuery, CustomerDTO> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(query: GetCustomerQuery): Promise<CustomerDTO> {
    const customer: Customer = await this.customerRepository.findById(query.customerId)

    return {
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phone: customer.getPhone(),
      email: customer.getEmail(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    }
  }
}
