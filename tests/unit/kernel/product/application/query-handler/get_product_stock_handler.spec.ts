import { test } from '@japa/runner'
import { GetProductStockHandler } from '#kernel/product/application/query-handler/get_product_stock_handler'
import { GetProductStockQuery } from '#kernel/product/application/query/get_product_stock_query'
import { StockReadModel } from '#kernel/product/application/read-model/stock_read_model'
import { ProductStockDto } from '#kernel/product/application/dto/stock_read_dto'
import { ProductNotFoundError } from '#kernel/product/application/errors/product_not_found_error'

test.group('GetProductStockHandler', () => {
  const createMockProductStock = (): ProductStockDto => ({
    productId: 'prod-1',
    quantity: 50,
    lowStockThreshold: 10,
    isLowStock: false,
    isOutOfStock: false,
  })

  test('should return stock information for product', async ({ assert }) => {
    const mockStock = createMockProductStock()

    const mockReadModel: StockReadModel = {
      getProductStock: async () => mockStock,
    }

    const handler = new GetProductStockHandler(mockReadModel)
    const query = new GetProductStockQuery('prod-1')

    const result = await handler.handle(query)

    assert.deepEqual(result, mockStock)
  })

  test('should throw ProductNotFoundError when product not found', async ({ assert }) => {
    const mockReadModel: StockReadModel = {
      getProductStock: async () => null,
    }

    const handler = new GetProductStockHandler(mockReadModel)
    const query = new GetProductStockQuery('non-existent-id')

    try {
      await handler.handle(query)
      assert.fail('Should have thrown ProductNotFoundError')
    } catch (error) {
      assert.instanceOf(error, ProductNotFoundError)
    }
  })

  test('should call getProductStock with correct productId', async ({ assert }) => {
    let capturedId: string | null = null
    const mockStock = createMockProductStock()

    const mockReadModel: StockReadModel = {
      getProductStock: async (id) => {
        capturedId = id
        return mockStock
      },
    }

    const handler = new GetProductStockHandler(mockReadModel)
    const query = new GetProductStockQuery('prod-123')

    await handler.handle(query)

    assert.equal(capturedId, 'prod-123')
  })

  test('should return stock with correct properties', async ({ assert }) => {
    const mockStock: ProductStockDto = {
      productId: 'prod-1',
      quantity: 5,
      lowStockThreshold: 10,
      isLowStock: true,
      isOutOfStock: false,
    }

    const mockReadModel: StockReadModel = {
      getProductStock: async () => mockStock,
    }

    const handler = new GetProductStockHandler(mockReadModel)
    const query = new GetProductStockQuery('prod-1')

    const result = await handler.handle(query)

    assert.equal(result.productId, 'prod-1')
    assert.equal(result.quantity, 5)
    assert.equal(result.lowStockThreshold, 10)
    assert.isTrue(result.isLowStock)
    assert.isFalse(result.isOutOfStock)
  })

  test('should return out of stock correctly', async ({ assert }) => {
    const mockStock: ProductStockDto = {
      productId: 'prod-1',
      quantity: 0,
      lowStockThreshold: 10,
      isLowStock: false,
      isOutOfStock: true,
    }

    const mockReadModel: StockReadModel = {
      getProductStock: async () => mockStock,
    }

    const handler = new GetProductStockHandler(mockReadModel)
    const query = new GetProductStockQuery('prod-1')

    const result = await handler.handle(query)

    assert.isTrue(result.isOutOfStock)
    assert.isFalse(result.isLowStock)
  })
})
