import { ProductRepository } from '#kernel/product/core/repository/product_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductCommand } from '../command/update_product_command'
import { Product } from '#kernel/product/core/entity/product'

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand> {
  constructor(private repository: ProductRepository) {}
  handle(command: UpdateProductCommand): Promise<void> {
    const store = new Product(
      command.productId,
      command.designation,
      command.categoryId,
      command.description,
      command.pictureUrl,
      command.price,
      command.brand
    )
    return this.repository.save(store)
  }
}
