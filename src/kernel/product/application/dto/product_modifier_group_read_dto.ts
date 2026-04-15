export interface ProductModifierReadDto {
  id: string
  designation: string
  priceAdjustment: number
  adjustmentType: 'fixed' | 'percentage'
  available: boolean
  sortIndex: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupReadDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multiple'
  required: boolean
  available: boolean
  sortIndex: number
  modifiers: ProductModifierReadDto[]
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupListItemDto {
  id: string
  designation: string
  selectionType: 'single' | 'multiple'
  required: boolean
  available: boolean
  sortIndex: number
  modifierCount: number
  createdAt: unknown
  updatedAt: unknown
}
