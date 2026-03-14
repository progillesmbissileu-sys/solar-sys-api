import { test } from '@japa/runner'
import { GetProductCategoryHandler } from '#kernel/product/application/query-handler/get_product_category_handler'
import { GetProductCategoryQuery } from '#kernel/product/application/query/get_product_category_query'
import { ProductCategoryReadModel } from '#kernel/product/application/read-model/product_category_read_model'
import { ProductCategoryDetailsDto } from '#kernel/product/application/dto/product_category_read_dto'
import { ProductCategoryNotFoundError } from '#kernel/product/application/errors/product_category_not_found_error'

test.group('GetProductCategoryHandler', () => {
  const createMockCategoryDetails = (): ProductCategoryDetailsDto => ({
    id: 'cat-1',
    designation: 'Solar Panels',
    slug: 'solar-panels-abc123',
    type: 'CATEGORY',
    parentId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  })

  test('should return category details when found', async ({ assert }) => {
    const mockCategory = createMockCategoryDetails()

    const mockReadModel: ProductCategoryReadModel = {
      getById: async () => mockCategory,
    }

    const handler = new GetProductCategoryHandler(mockReadModel)
    const query = new GetProductCategoryQuery('cat-1')

    const result = await handler.handle(query)

    assert.deepEqual(result, mockCategory)
  })

  test('should throw ProductCategoryNotFoundError when category not found', async ({ assert }) => {
    const mockReadModel: ProductCategoryReadModel = {
      getById: async () => null,
    }

    const handler = new GetProductCategoryHandler(mockReadModel)
    const query = new GetProductCategoryQuery('non-existent-id')

    try {
      await handler.handle(query)
      assert.fail('Should have thrown ProductCategoryNotFoundError')
    } catch (error) {
      assert.instanceOf(error, ProductCategoryNotFoundError)
    }
  })

  test('should call getById with correct categoryId', async ({ assert }) => {
    let capturedId: string | null = null
    const mockCategory = createMockCategoryDetails()

    const mockReadModel: ProductCategoryReadModel = {
      getById: async (id) => {
        capturedId = id
        return mockCategory
      },
    }

    const handler = new GetProductCategoryHandler(mockReadModel)
    const query = new GetProductCategoryQuery('cat-123')

    await handler.handle(query)

    assert.equal(capturedId, 'cat-123')
  })

  test('should return category with all properties', async ({ assert }) => {
    const mockCategory = createMockCategoryDetails()

    const mockReadModel: ProductCategoryReadModel = {
      getById: async () => mockCategory,
    }

    const handler = new GetProductCategoryHandler(mockReadModel)
    const query = new GetProductCategoryQuery('cat-1')

    const result = await handler.handle(query)

    assert.equal(result.id, 'cat-1')
    assert.equal(result.designation, 'Solar Panels')
    assert.equal(result.type, 'CATEGORY')
    assert.equal(result.parentId, null)
  })
})
