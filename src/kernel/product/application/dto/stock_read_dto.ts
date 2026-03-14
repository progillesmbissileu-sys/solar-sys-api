export interface ProductStockDto {
  productId: string
  quantity: number
  lowStockThreshold: number
  isLowStock: boolean
  isOutOfStock: boolean
}

export interface StockMovementDto {
  id: string
  operationType: string
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason: string | null
  createdAt: unknown
}

export interface LowStockProductDto {
  id: string
  designation: string
  stockQuantity: number
  lowStockThreshold: number
  slug: string
}
