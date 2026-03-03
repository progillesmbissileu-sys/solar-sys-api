import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'

export class CreateProductHandler implements CommandHandler<CreateProductCommand> {
  constructor(private repository: ProductRepository) {}
  async handle(command: CreateProductCommand): Promise<void> {
    const product = new Product(
      null,
      command.designation,
      command.mainImageId,
      command.categoryId,
      command.description,
      command.price,
      command.brand
    )

    // Save product and additional images
    await this.repository.save(product, command.imageIds)
  }
}
