import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { AddProductImageCommand } from '../command/add_product_image_command'
import { ProductImageRepository } from '#kernel/product/domain/repository/product_image_repository'

const MAX_IMAGES_PER_PRODUCT = 3

export class AddProductImageHandler implements CommandHandler<AddProductImageCommand> {
  constructor(private productImageRepository: ProductImageRepository) {}

  async handle(command: AddProductImageCommand): Promise<void> {
    // Check if product exists and get current main image status
    const hasMainImage = await this.productImageRepository.hasMainImage(command.productId)

    // If adding a main image and one already exists, it will replace it (no count increase)
    // If adding an additional image, or adding a main image when none exists, check limit
    if (!command.isMainImage || !hasMainImage) {
      // Count current images for the product
      const currentImageCount = await this.productImageRepository.countImages(command.productId)

      // Check if adding this image would exceed the maximum allowed
      if (currentImageCount >= MAX_IMAGES_PER_PRODUCT) {
        throw new Error(
          `Cannot add more images. Product already has the maximum of ${MAX_IMAGES_PER_PRODUCT} images.`
        )
      }
    }

    await this.productImageRepository.addImage(
      command.productId,
      command.imageId,
      command.isMainImage
    )
  }
}
