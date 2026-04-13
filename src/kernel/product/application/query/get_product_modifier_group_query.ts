import { Query } from '#shared/application/use-cases/query'

export class GetProductModifierGroupQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly id: string
  ) {
    this.timestamp = new Date()
  }
}
