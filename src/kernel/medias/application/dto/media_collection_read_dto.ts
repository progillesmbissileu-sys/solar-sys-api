export interface MediaCollectionListItemDto {
  id: string
  name: string
  description: string | null
  createdAt: unknown
  updatedAt: unknown
}

export interface CollectionImageDto {
  id: string
  imageId: string
  url: string | null
  altDescription: string
  sortOrder: number
}

export interface MediaCollectionDetailsDto {
  id: string
  name: string
  description: string | null
  images: CollectionImageDto[]
  createdAt: unknown
  updatedAt: unknown
}
