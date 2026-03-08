import { test } from '@japa/runner'
import { RemoveProductImageHandler } from '#kernel/product/application/command-handler/remove_product_image_handler'
import { RemoveProductImageCommand } from '#kernel/product/application/command/remove_product_image_command'
import { ProductImageRepository } from '#kernel/product/domain/repository/product_image_repository'

test.group('RemoveProductImageHandler', () => {
  test('should remove image when owned by product', async ({ assert }) => {
    let removeImageCalled = false

    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        throw new Error('Not implemented')
      },
      removeImage: async () => {
        removeImageCalled = true
      },
      countImages: async () => 0,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => true, // Image belongs to product
    }

    const handler = new RemoveProductImageHandler(mockRepository)
    const command = new RemoveProductImageCommand('prod-1', 'img-1')

    await handler.handle(command)

    assert.isTrue(removeImageCalled)
  })

  test('should throw error when image not owned by product', async ({ assert }) => {
    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        throw new Error('Not implemented')
      },
      removeImage: async () => {},
      countImages: async () => 0,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => false, // Image does NOT belong to product
    }

    const handler = new RemoveProductImageHandler(mockRepository)
    const command = new RemoveProductImageCommand('prod-1', 'img-999')

    try {
      await handler.handle(command)
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.instanceOf(error, Error)
      assert.equal((error as Error).message, 'Image not found or does not belong to this product')
    }
  })

  test('should call isImageOwnedByProduct before removal', async ({ assert }) => {
    let isImageOwnedByProductCalled = false
    let callOrder: string[] = []

    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        throw new Error('Not implemented')
      },
      removeImage: async () => {
        callOrder.push('removeImage')
      },
      countImages: async () => 0,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => {
        callOrder.push('isImageOwnedByProduct')
        isImageOwnedByProductCalled = true
        return true
      },
    }

    const handler = new RemoveProductImageHandler(mockRepository)
    const command = new RemoveProductImageCommand('prod-1', 'img-1')

    await handler.handle(command)

    assert.isTrue(isImageOwnedByProductCalled)
    assert.deepEqual(callOrder, ['isImageOwnedByProduct', 'removeImage'])
  })

  test('should call removeImage with correct parameters', async ({ assert }) => {
    let capturedProductId: string | null = null
    let capturedImageId: string | null = null

    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        throw new Error('Not implemented')
      },
      removeImage: async (productId, imageId) => {
        capturedProductId = productId
        capturedImageId = imageId
      },
      countImages: async () => 0,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => true,
    }

    const handler = new RemoveProductImageHandler(mockRepository)
    const command = new RemoveProductImageCommand('prod-123', 'img-456')

    await handler.handle(command)

    assert.equal(capturedProductId, 'prod-123')
    assert.equal(capturedImageId, 'img-456')
  })

  test('should call isImageOwnedByProduct with correct parameters', async ({ assert }) => {
    let capturedProductId: string | null = null
    let capturedImageId: string | null = null

    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        throw new Error('Not implemented')
      },
      removeImage: async () => {},
      countImages: async () => 0,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async (productId, imageId) => {
        capturedProductId = productId
        capturedImageId = imageId
        return true
      },
    }

    const handler = new RemoveProductImageHandler(mockRepository)
    const command = new RemoveProductImageCommand('prod-123', 'img-456')

    await handler.handle(command)

    assert.equal(capturedProductId, 'prod-123')
    assert.equal(capturedImageId, 'img-456')
  })

  test('should not call removeImage when ownership check fails', async ({ assert }) => {
    let removeImageCalled = false

    const mockRepository: ProductImageRepository = {
      addImage: async () => {
        throw new Error('Not implemented')
      },
      removeImage: async () => {
        removeImageCalled = true
      },
      countImages: async () => 0,
      hasMainImage: async () => false,
      isImageOwnedByProduct: async () => false,
    }

    const handler = new RemoveProductImageHandler(mockRepository)
    const command = new RemoveProductImageCommand('prod-1', 'img-1')

    try {
      await handler.handle(command)
    } catch {
      // Expected error
    }

    assert.isFalse(removeImageCalled)
  })
})
