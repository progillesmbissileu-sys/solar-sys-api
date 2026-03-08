import { test } from '@japa/runner'
import { CreateProductHandler } from '#kernel/product/application/command-handler/create_product_handler'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'

test.group('CreateProductHandler', () => {
  test('should create product with valid command data', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand(
      '300W Solar Panel',
      'img-1',
      'cat-1',
      'High efficiency solar panel',
      299.99,
      'SunPower',
      ['img-2', 'img-3']
    )

    await handler.handle(command)

    assert.isDefined(savedProduct)
    assert.equal(savedProduct!.getDesignation(), '300W Solar Panel')
    assert.equal(savedProduct!.getDescription(), 'High efficiency solar panel')
    assert.equal(savedProduct!.getPrice(), 299.99)
    assert.equal(savedProduct!.getBrand(), 'SunPower')
  })

  test('should call repository.save with correct product entity', async ({ assert }) => {
    let saveCalled = false
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        saveCalled = true
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test Product', 'img-1', 'cat-1', 'Description', 100)

    await handler.handle(command)

    assert.isTrue(saveCalled)
    assert.isDefined(savedProduct)
  })

  test('should map imageIds to ProductImage instances', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', 'img-1', 'cat-1', 'Desc', 100, undefined, [
      'img-2',
      'img-3',
    ])

    await handler.handle(command)

    const images = savedProduct!.getImages()
    assert.lengthOf(images, 2)
    assert.equal(images[0].id, 'img-2')
    assert.equal(images[1].id, 'img-3')
  })

  test('should set mainImage from mainImageId', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', 'main-img-123', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getMainImage().id, 'main-img-123')
  })

  test('should set category from categoryId', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', 'img-1', 'cat-456', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getCategory().getId(), 'cat-456')
  })

  test('should handle empty imageIds array', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', 'img-1', 'cat-1', 'Desc', 100, undefined, [])

    await handler.handle(command)

    assert.deepEqual(savedProduct!.getImages(), [])
  })
})
