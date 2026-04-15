import { Command } from '#shared/application/use-cases/command'
import { SelectionType } from '#kernel/product/domain/type/selection_type'

export class UpdateProductModifierGroupCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly id: string,
    public readonly designation: string,
    public readonly minSelections: number = 0,
    public readonly maxSelections: number | null = null,
    public readonly selectionType: SelectionType = SelectionType.MULTIPLE,
    public readonly required: boolean = false,
    public readonly available: boolean = true,
    public readonly sortIndex: number = 0
  ) {
    this.timestamp = new Date()
  }
}
