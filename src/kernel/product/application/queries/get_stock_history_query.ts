import { Query } from '#shared/application/use-cases/query'

export class GetStockHistoryQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly productId: string,
    public readonly page: number,
    public readonly limit: number
  ) {
    this.timestamp = new Date()
  }
}
