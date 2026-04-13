import { Command } from '#shared/application/use-cases/command'
import { SelectionType } from '#kernel/product/domain/type/selection_type'

export class CreateProductModifierGroupCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly designation: string,
    public readonly minSelections: number = 0,
    public readonly maxSelections: number | null = null,
    public readonly selectionType: SelectionType = SelectionType.MULTI,
    public readonly required: boolean = false,
    public readonly available: boolean = true,
    public readonly sortOrder: number = 0
  ) {
    this.timestamp = new Date()
  }
}
