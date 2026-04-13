export interface ProductModifierReadDto {
  id: string
  designation: string
  priceAdjustment: number
  adjustmentType: 'fixed' | 'percentage'
  available: boolean
  sortOrder: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupReadDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multi'
  required: boolean
  available: boolean
  sortOrder: number
  modifiers: ProductModifierReadDto[]
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupListItemDto {
  id: string
  designation: string
  selectionType: 'single' | 'multi'
  required: boolean
  available: boolean
  sortOrder: number
  modifierCount: number
  createdAt: unknown
  updatedAt: unknown
}
