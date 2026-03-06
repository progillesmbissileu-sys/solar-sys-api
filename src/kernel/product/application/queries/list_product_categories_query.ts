import { Query } from '#shared/application/use-cases/query'

export class ListProductCategoriesQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly search: string
  ) {
    this.timestamp = new Date()
  }
}
