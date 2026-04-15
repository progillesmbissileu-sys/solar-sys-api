import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductModifierCommand } from '#kernel/product/application/command/update_product_modifier_command'
import { ProductModifierRepository } from '#kernel/product/domain/repository/product_modifier_repository'
import { AppId } from '#shared/domain/app_id'

export class UpdateProductModifierHandler implements CommandHandler<UpdateProductModifierCommand> {
  constructor(private repository: ProductModifierRepository) {}

  async handle(command: UpdateProductModifierCommand): Promise<void> {
    // Find the existing modifier
    const existingModifier = await this.repository.find(AppId.fromString(command.id))

    // Update the modifier properties
    existingModifier.setDesignation(command.designation)
    existingModifier.setPriceAdjustment(command.priceAdjustment)
    existingModifier.setAdjustmentType(command.adjustmentType)
    existingModifier.setAvailable(command.available)
    existingModifier.setSortIndex(command.sortIndex)

    // Save the updated modifier
    await this.repository.save(existingModifier)
  }
}
