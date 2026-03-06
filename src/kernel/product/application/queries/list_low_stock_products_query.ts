import { Query } from '#shared/application/use-cases/query'

export class ListLowStockProductsQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly page: number,
    public readonly limit: number
  ) {
    this.timestamp = new Date()
  }
}
