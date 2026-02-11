import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'

export class CreateProductHandler implements CommandHandler<CreateProductCommand> {
  constructor(private repository: ProductRepository) {}
  handle(command: CreateProductCommand): Promise<void> {
    const store = new Product(
      null,
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
