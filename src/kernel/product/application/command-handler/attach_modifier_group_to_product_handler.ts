import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { AttachModifierGroupToProductCommand } from '#kernel/product/application/command/attach_modifier_group_to_product_command'
import { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import { AppId } from '#shared/domain/app_id'

export class AttachModifierGroupToProductHandler implements CommandHandler<AttachModifierGroupToProductCommand> {
  constructor(private repository: ProductModifierGroupRepository) {}

  async handle(command: AttachModifierGroupToProductCommand): Promise<void> {
    await this.repository.attachToProduct(
      AppId.fromString(command.productId),
      AppId.fromString(command.modifierGroupId),
      command.sortOrder
    )
  }
}
