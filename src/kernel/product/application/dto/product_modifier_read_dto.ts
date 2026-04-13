export interface ProductModifierListItemDto {
  id: string
  designation: string
  modifierGroupId: string
  priceAdjustment: number
  adjustmentType: 'fixed' | 'percentage'
  available: boolean
  sortOrder: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierDetailsDto {
  id: string
  designation: string
  modifierGroupId: string
  priceAdjustment: number
  adjustmentType: 'fixed' | 'percentage'
  available: boolean
  sortOrder: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupListItemDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multi'
  required: boolean
  available: boolean
  sortOrder: number
  modifiersCount: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupDetailsDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multi'
  required: boolean
  available: boolean
  sortOrder: number
  modifiers: ProductModifierListItemDto[]
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupWithModifiersDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multi'
  required: boolean
  available: boolean
  sortOrder: number
  modifiers: ProductModifierListItemDto[]
  createdAt: unknown
  updatedAt: unknown
}
