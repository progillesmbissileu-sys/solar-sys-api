import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { RemoveProductImageCommand } from '../command/remove_product_image_command'
import { ProductImageRepository } from '#kernel/product/domain/repository/product_image_repository'

export class RemoveProductImageHandler implements CommandHandler<RemoveProductImageCommand> {
  constructor(private productImageRepository: ProductImageRepository) {}

  async handle(command: RemoveProductImageCommand): Promise<void> {
    // Verify the image belongs to this product before removing
    const isOwner = await this.productImageRepository.isImageOwnedByProduct(
      command.productId,
      command.imageId
    )

    if (!isOwner) {
      throw new Error('Image not found or does not belong to this product')
    }

    await this.productImageRepository.removeImage(command.productId, command.imageId)
  }
}
