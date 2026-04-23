export class CollectionItem {
  constructor(
    private readonly collectionId: string,
    private readonly imageId: string,
    private readonly sortOrder: number
  ) {}

  getCollectionId(): string {
    return this.collectionId
  }

  getImageId(): string {
    return this.imageId
  }

  getSortOrder(): number {
    return this.sortOrder
  }
}
