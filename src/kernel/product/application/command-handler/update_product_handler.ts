import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductCommand } from '../command/update_product_command'
import { Product } from '#kernel/product/domain/entity/product'

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand> {
  constructor(private repository: ProductRepository) {}
  async handle(command: UpdateProductCommand): Promise<void> {
    const existingProduct = await this.repository.findById(command.productId)

    const updatedProduct = new Product(
      existingProduct.getId(),
      command.designation,
      command.mainImageId,
      command.categoryId,
      command.description,
      command.price,
      command.brand,
      existingProduct.getSlug(),
      command.isAvailable,
      command.isDeleted,
      existingProduct.getCreatedAt()
    )

    // Save product and update additional images
    await this.repository.save(updatedProduct, command.imageIds)
  }
}
