import { Query } from '#shared/application/use-cases/query'

export class GetMediaCollectionQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly collectionId: string) {
    this.timestamp = new Date()
  }
}
