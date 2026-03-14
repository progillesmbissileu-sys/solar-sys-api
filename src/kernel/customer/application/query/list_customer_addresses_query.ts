import { Query } from '#shared/application/use-cases/query'

export class ListCustomerAddressesQuery implements Query {
  readonly timestamp: Date
  constructor(public readonly customerId: string) {
    this.timestamp = new Date()
  }
}
