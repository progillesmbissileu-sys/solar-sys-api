import { ProductPackItemRepository } from '#kernel/product/domain/repository/product_pack_item_repository'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { RemoveProductPackItemCommand } from '../command/remove_product_pack_item'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ApplicationError } from '#shared/application/errors/application_error'
import { ProductApplicationError } from '#kernel/product/application/errors/codes'

export class RemoveProductPackItemHandler implements CommandHandler<RemoveProductPackItemCommand> {
  constructor(
    private repository: ProductPackItemRepository,
    private packRepository: ProductPackRepository
  ) {}

  async handle(command: RemoveProductPackItemCommand): Promise<void> {
    const item = await this.repository.find(command.itemId)
    if (!item) {
      throw new NotFoundApplicationError(
        `Product pack item with id ${command.itemId.value} not found`
      )
    }

    const productPack = await this.packRepository.find(item?.getPackId()!)

    if (!productPack) {
      throw new NotFoundApplicationError(
        `Product pack with id ${item?.getPackId()?.value} not found`
      )
    }

    const canRemove = productPack.getItems().length > 1

    if (!canRemove) {
      throw new ApplicationError(
        ProductApplicationError.PRODUCT_PACK_ITEM_REMOVE_LAST_ITEM_ERROR,
        'product pack should keep at least one item'
      )
    }

    await this.repository.delete(command.itemId)
  }
}
