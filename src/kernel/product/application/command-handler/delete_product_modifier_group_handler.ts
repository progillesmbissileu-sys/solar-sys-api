import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteProductModifierGroupCommand } from '#kernel/product/application/command/delete_product_modifier_group_command'
import { ProductModifierGroupRepository } from '#kernel/product/domain/repository/product_modifier_group_repository'
import { AppId } from '#shared/domain/app_id'

export class DeleteProductModifierGroupHandler implements CommandHandler<DeleteProductModifierGroupCommand> {
  constructor(private repository: ProductModifierGroupRepository) {}

  async handle(command: DeleteProductModifierGroupCommand): Promise<void> {
    await this.repository.delete(AppId.fromString(command.id))
  }
}
