import { AppId } from '#shared/domain/app_id'
import { AdjustmentType } from '#kernel/product/domain/type/adjustment_type'

export class ProductModifier {
  constructor(
    private id: AppId | null,
    private modifierGroupId: AppId,
    private designation: string,
    private priceAdjustment: number = 0,
    private adjustmentType: AdjustmentType = AdjustmentType.FIXED,
    private available: boolean = true,
    private sortOrder: number = 0,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): AppId | null {
    return this.id
  }

  setId(id: AppId): void {
    this.id = id
  }

  getModifierGroupId(): AppId {
    return this.modifierGroupId
  }

  getDesignation(): string {
    return this.designation
  }

  getPriceAdjustment(): number {
    return this.priceAdjustment
  }

  getAdjustmentType(): AdjustmentType {
    return this.adjustmentType
  }

  isAvailable(): boolean {
    return this.available
  }

  getSortOrder(): number {
    return this.sortOrder
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  setDesignation(designation: string): void {
    this.designation = designation
  }

  setPriceAdjustment(priceAdjustment: number): void {
    this.priceAdjustment = priceAdjustment
  }

  setAdjustmentType(adjustmentType: AdjustmentType): void {
    this.adjustmentType = adjustmentType
  }

  setAvailable(available: boolean): void {
    this.available = available
  }

  setSortOrder(sortOrder: number): void {
    this.sortOrder = sortOrder
  }

  /**
   * Calculate the adjusted price based on base price
   */
  calculateAdjustedPrice(basePrice: number): number {
    if (this.adjustmentType === AdjustmentType.PERCENTAGE) {
      return basePrice + (basePrice * this.priceAdjustment / 100)
    }
    return basePrice + this.priceAdjustment
  }

  /**
   * Check if this modifier adds cost
   */
  addsCost(): boolean {
    return this.priceAdjustment > 0
  }

  /**
   * Check if this modifier reduces cost
   */
  reducesCost(): boolean {
    return this.priceAdjustment < 0
  }

  /**
   * Check if this modifier has no price impact
   */
  hasNoPriceImpact(): boolean {
    return this.priceAdjustment === 0
  }
}
