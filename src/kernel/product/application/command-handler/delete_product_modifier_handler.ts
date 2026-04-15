import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteProductModifierCommand } from '#kernel/product/application/command/delete_product_modifier_command'
import { ProductModifierRepository } from '#kernel/product/domain/repository/product_modifier_repository'
import { AppId } from '#shared/domain/app_id'

export class DeleteProductModifierHandler implements CommandHandler<DeleteProductModifierCommand> {
  constructor(private repository: ProductModifierRepository) {}

  async handle(command: DeleteProductModifierCommand): Promise<void> {
    await this.repository.delete(AppId.fromString(command.id))
  }
}
