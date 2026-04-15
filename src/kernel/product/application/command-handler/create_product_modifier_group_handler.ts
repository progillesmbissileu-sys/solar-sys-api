import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductModifierGroupCommand } from '#kernel/product/application/command/create_product_modifier_group_command'
import { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import { ProductModifierGroup } from '#kernel/product/domain/entity/product_modifier_group'

export class CreateProductModifierGroupHandler implements CommandHandler<CreateProductModifierGroupCommand> {
  constructor(private repository: ProductModifierGroupRepository) {}

  async handle(command: CreateProductModifierGroupCommand): Promise<void> {
    const group = new ProductModifierGroup(
      null,
      command.designation,
      command.minSelections,
      command.maxSelections,
      command.selectionType,
      command.required,
      command.available,
      command.sortIndex,
      [] // No modifiers initially
    )

    await this.repository.save(group)
  }
}
