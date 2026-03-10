import { Query } from '#shared/application/use-cases/query'

export class GetProductPackStockQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly packId: string) {
    this.timestamp = new Date()
  }
}
