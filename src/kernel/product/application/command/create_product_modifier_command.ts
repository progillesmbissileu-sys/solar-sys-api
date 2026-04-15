import { Command } from '#shared/application/use-cases/command'
import { AdjustmentType } from '#kernel/product/domain/type/adjustment_type'

export class CreateProductModifierCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly modifierGroupId: string,
    public readonly designation: string,
    public readonly priceAdjustment: number = 0,
    public readonly adjustmentType: AdjustmentType = AdjustmentType.FIXED,
    public readonly available: boolean = true,
    public readonly sortIndex: number = 0
  ) {
    this.timestamp = new Date()
  }
}
