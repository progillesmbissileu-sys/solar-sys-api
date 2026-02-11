import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductCommand } from '../command/update_product_command'
import { Product } from '#kernel/product/domain/entity/product'

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand> {
  constructor(private repository: ProductRepository) {}
  async handle(command: UpdateProductCommand): Promise<void> {
    const store = await this.repository.findById(command.productId)

    return this.repository.save(
      new Product(
        store.getId(),
        command.designation,
        command.pictureId,
        command.categoryId,
        command.description,
        command.price,
        command.brand,
        store.getSlug(),
        command.isAvailable,
        command.isDeleted,
        store.getCreatedAt()
      )
    )
  }
}
