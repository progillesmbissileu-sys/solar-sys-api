import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductModifierGroupCommand } from '#kernel/product/application/command/update_product_modifier_group_command'
import { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import { ProductModifierGroup } from '#kernel/product/domain/entity/product_modifier_group'
import { AppId } from '#shared/domain/app_id'

export class UpdateProductModifierGroupHandler implements CommandHandler<UpdateProductModifierGroupCommand> {
  constructor(private repository: ProductModifierGroupRepository) {}

  async handle(command: UpdateProductModifierGroupCommand): Promise<void> {
    // Find the existing group
    const existingGroup = await this.repository.find(AppId.fromString(command.id))

    // Update the group properties
    existingGroup.setDesignation(command.designation)
    existingGroup.setMinSelections(command.minSelections)
    existingGroup.setMaxSelections(command.maxSelections)
    existingGroup.setSelectionType(command.selectionType)
    existingGroup.setRequired(command.required)
    existingGroup.setAvailable(command.available)
    existingGroup.setSortOrder(command.sortOrder)

    // Save the updated group
    await this.repository.save(existingGroup)
  }
}
