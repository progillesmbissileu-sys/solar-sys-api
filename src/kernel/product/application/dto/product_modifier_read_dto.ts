export interface ProductModifierListItemDto {
  id: string
  designation: string
  modifierGroupId: string
  priceAdjustment: number
  adjustmentType: 'fixed' | 'percentage'
  available: boolean
  sortIndex: number
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
  sortIndex: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupListItemDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multiple'
  required: boolean
  available: boolean
  sortIndex: number
  modifiersCount: number
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupDetailsDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multiple'
  required: boolean
  available: boolean
  sortIndex: number
  modifiers: ProductModifierListItemDto[]
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductModifierGroupWithModifiersDto {
  id: string
  designation: string
  minSelections: number
  maxSelections: number | null
  selectionType: 'single' | 'multiple'
  required: boolean
  available: boolean
  sortIndex: number
  modifiers: ProductModifierListItemDto[]
  createdAt: unknown
  updatedAt: unknown
}
