import { Query } from '#shared/application/use-cases/query'

export class ListCustomersQuery implements Query {
  readonly timestamp: Date

  constructor() {
    this.timestamp = new Date()
  }
}
