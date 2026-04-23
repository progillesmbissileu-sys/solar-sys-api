import { Command } from '#shared/application/use-cases/command'

export interface ImageOrderItem {
  imageId: string
  sortOrder: number
}

export class ReorderCollectionImagesCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly collectionId: string,
    public readonly imageOrders: ImageOrderItem[]
  ) {
    this.timestamp = new Date()
  }
}
