import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductModifierCommand } from '#kernel/product/application/command/create_product_modifier_command'
import { ProductModifierRepository } from '#kernel/product/domain/repository/product_modifier_repository'
import { ProductModifier } from '#kernel/product/domain/entity/product_modifier'
import { AppId } from '#shared/domain/app_id'

export class CreateProductModifierHandler implements CommandHandler<CreateProductModifierCommand> {
  constructor(private repository: ProductModifierRepository) {}

  async handle(command: CreateProductModifierCommand): Promise<void> {
    const modifier = new ProductModifier(
      null,
      AppId.fromString(command.modifierGroupId),
      command.designation,
      command.priceAdjustment,
      command.adjustmentType,
      command.available,
      command.sortIndex
    )

    await this.repository.save(modifier)
  }
}
