import { Command } from '#shared/application/use-cases/command'

export interface AddImageItem {
  imageId: string
  sortOrder?: number
}

export class AddImagesToCollectionCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly collectionId: string,
    public readonly images: AddImageItem[]
  ) {
    this.timestamp = new Date()
  }
}
