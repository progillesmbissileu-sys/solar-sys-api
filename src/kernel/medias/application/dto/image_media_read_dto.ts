export interface ImageMediaListItemDto {
  id: string
  title: string
  url: string | null
  altDescription: string
  createdAt: unknown
  updatedAt: unknown
}

export interface ImageMediaDetailsDto {
  id: string
  title: string
  url: string | null
  altDescription: string
  metadata: any
  relativeKey: string
  createdAt: unknown
  updatedAt: unknown
}
