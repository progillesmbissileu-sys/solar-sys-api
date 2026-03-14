import { test } from '@japa/runner'
import { AddProductImageHandler } from '#kernel/product/application/command-handler/add_product_image_handler'
import { AddProductImageCommand } from '#kernel/product/application/command/add_product_image_command'
import { ProductImageRepository } from '#kernel/product/domain/repository/product_image_repository'
import { ProductImageLimitReachedError } from '#kernel/product/domain/errors/product_image_limit_reached_error'

test.group('AddProductImageHandler', () => {
  test('should add image when under limit', async ({ assert }) => {
    let addImageCalled = false

    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        addImageCalled = true
      },
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => 1, // Under limit
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-1', 'img-1', false)

    await handler.handle(command)

    assert.isTrue(addImageCalled)
  })

  test('should throw ProductImageLimitReachedError when limit reached (3 images)', async ({
    assert,
  }) => {
    const mockRepository: ProductImageRepository = {
      addImage: async () => {},
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => 3, // At limit
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-1', 'img-4', false)

    try {
      await handler.handle(command)
      assert.fail('Should have thrown ProductImageLimitReachedError')
    } catch (error) {
      assert.instanceOf(error, ProductImageLimitReachedError)
      assert.equal(
        (error as ProductImageLimitReachedError).message,
        'Cannot add more images to this product'
      )
    }
  })

  test('should allow replacing main image without counting toward limit', async ({ assert }) => {
    let addImageCalled = false
    let passedIsMainImage = false

    const mockRepository: ProductImageRepository = {
      addImage: async (_productId, _imageId, isMainImage) => {
        addImageCalled = true
        passedIsMainImage = isMainImage
      },
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => 3, // At limit
      hasMainImage: async () => true, // Already has main image
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-1', 'new-main-img', true)

    await handler.handle(command)

    assert.isTrue(addImageCalled)
    assert.isTrue(passedIsMainImage)
  })

  test('should check hasMainImage when isMainImage is true', async ({ assert }) => {
    let hasMainImageCalled = false

    const mockRepository: ProductImageRepository = {
      addImage: async () => {},
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => 3,
      hasMainImage: async () => {
        hasMainImageCalled = true
        return true
      },
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-1', 'img-1', true)

    await handler.handle(command)

    assert.isTrue(hasMainImageCalled)
  })

  test('should count images when adding additional image', async ({ assert }) => {
    let countImagesCalled = false

    const mockRepository: ProductImageRepository = {
      addImage: async () => {},
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => {
        countImagesCalled = true
        return 2
      },
      hasMainImage: async () => true,
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-1', 'img-3', false)

    await handler.handle(command)

    assert.isTrue(countImagesCalled)
  })

  test('should call addImage with correct parameters', async ({ assert }) => {
    let capturedProductId: string | null = null
    let capturedImageId: string | null = null
    let capturedIsMainImage: boolean | null = null

    const mockRepository: ProductImageRepository = {
      addImage: async (productId, imageId, isMainImage) => {
        capturedProductId = productId
        capturedImageId = imageId
        capturedIsMainImage = isMainImage
      },
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => 1,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-123', 'img-456', true)

    await handler.handle(command)

    assert.equal(capturedProductId, 'prod-123')
    assert.equal(capturedImageId, 'img-456')
    assert.equal(capturedIsMainImage, true)
  })

  test('should throw error when adding main image with no existing main and at limit', async ({
    assert,
  }) => {
    const mockRepository: ProductImageRepository = {
      addImage: async () => {},
      removeImage: async () => {
        throw new Error('Not implemented')
      },
      countImages: async () => 3,
      hasMainImage: async () => false, // No main image exists
      isImageOwnedByProduct: async () => false,
    }

    const handler = new AddProductImageHandler(mockRepository)
    const command = new AddProductImageCommand('prod-1', 'img-1', true)

    try {
      await handler.handle(command)
      assert.fail('Should have thrown ProductImageLimitReachedError')
    } catch (error) {
      assert.instanceOf(error, ProductImageLimitReachedError)
    }
  })
})
