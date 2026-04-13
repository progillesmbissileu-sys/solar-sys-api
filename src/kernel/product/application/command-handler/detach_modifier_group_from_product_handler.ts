import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DetachModifierGroupFromProductCommand } from '#kernel/product/application/command/detach_modifier_group_from_product_command'
import { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import { AppId } from '#shared/domain/app_id'

export class DetachModifierGroupFromProductHandler implements CommandHandler<DetachModifierGroupFromProductCommand> {
  constructor(private repository: ProductModifierGroupRepository) {}

  async handle(command: DetachModifierGroupFromProductCommand): Promise<void> {
    await this.repository.detachFromProduct(
      AppId.fromString(command.productId),
      AppId.fromString(command.modifierGroupId)
    )
  }
}
