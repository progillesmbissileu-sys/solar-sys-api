import { Query } from '#shared/application/use-cases/query'

export class GetProductPackQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly packId: string) {
    this.timestamp = new Date()
  }
}
