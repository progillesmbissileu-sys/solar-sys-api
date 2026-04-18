import { Query } from '#shared/application/use-cases/query'

export class GetImageMediaQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly imageMediaId: string) {
    this.timestamp = new Date()
  }
}
