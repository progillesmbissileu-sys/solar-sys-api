export interface ProductCategoryListItemDto {
  id: string
  designation: string
  slug: string | null
  type: 'CATEGORY' | 'TAG'
  parentId: string | null
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductCategoryDetailsDto extends ProductCategoryListItemDto {}

export interface CategoryProductListItemDto {
  id: string
  slug: string
  designation: string
  price: number
  categoryName: string | null
  categoryId: string | null
  pictureUrl: string | null
  brand: string | null
  createdAt: unknown
  updatedAt: unknown
}
