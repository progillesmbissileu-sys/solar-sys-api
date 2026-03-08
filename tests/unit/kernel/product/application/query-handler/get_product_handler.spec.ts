import { test } from '@japa/runner'
import { GetProductHandler } from '#kernel/product/application/query-handler/get_product_handler'
import { GetProductQuery } from '#kernel/product/application/query/get_product_query'
import { ProductReadModel } from '#kernel/product/application/read-model/product_read_model'
import { ProductDetailsDto } from '#kernel/product/application/dto/product_read_dto'
import { ProductNotFoundError } from '#kernel/product/application/errors/product_not_found_error'

test.group('GetProductHandler', () => {
  const createMockProductDetails = (): ProductDetailsDto => ({
    id: 'prod-1',
    slug: 'test-product-abc123',
    categoryId: 'cat-1',
    designation: 'Test Product',
    description: 'Test Description',
    price: 299.99,
    brand: 'TestBrand',
    isAvailable: true,
    isDeleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    category: {
      id: 'cat-1',
      designation: 'Test Category',
    },
    mainImage: {
      id: 'img-1',
      url: 'https://example.com/image.jpg',
      alt: 'Product Image',
      title: 'Product Photo',
    },
    images: [],
  })

  test('should return product details when found', async ({ assert }) => {
    const mockProduct = createMockProductDetails()

    const mockReadModel: ProductReadModel = {
      getById: async () => mockProduct,
      getBySlug: async () => null,
    }

    const handler = new GetProductHandler(mockReadModel)
    const query = new GetProductQuery('prod-1')

    const result = await handler.handle(query)

    assert.deepEqual(result, mockProduct)
  })

  test('should throw ProductNotFoundError when product not found', async ({ assert }) => {
    const mockReadModel: ProductReadModel = {
      getById: async () => null,
      getBySlug: async () => null,
    }

    const handler = new GetProductHandler(mockReadModel)
    const query = new GetProductQuery('non-existent-id')

    try {
      await handler.handle(query)
      assert.fail('Should have thrown ProductNotFoundError')
    } catch (error) {
      assert.instanceOf(error, ProductNotFoundError)
    }
  })

  test('should call getById with correct productId', async ({ assert }) => {
    let capturedId: string | null = null
    const mockProduct = createMockProductDetails()

    const mockReadModel: ProductReadModel = {
      getById: async (id) => {
        capturedId = id
        return mockProduct
      },
      getBySlug: async () => null,
    }

    const handler = new GetProductHandler(mockReadModel)
    const query = new GetProductQuery('prod-123')

    await handler.handle(query)

    assert.equal(capturedId, 'prod-123')
  })

  test('should return product with all properties', async ({ assert }) => {
    const mockProduct = createMockProductDetails()

    const mockReadModel: ProductReadModel = {
      getById: async () => mockProduct,
      getBySlug: async () => null,
    }

    const handler = new GetProductHandler(mockReadModel)
    const query = new GetProductQuery('prod-1')

    const result = await handler.handle(query)

    assert.equal(result.id, 'prod-1')
    assert.equal(result.designation, 'Test Product')
    assert.equal(result.price, 299.99)
    assert.equal(result.category.designation, 'Test Category')
    assert.equal(result.mainImage.url, 'https://example.com/image.jpg')
  })
})
