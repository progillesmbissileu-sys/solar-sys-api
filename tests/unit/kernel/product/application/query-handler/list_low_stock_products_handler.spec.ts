import { test } from '@japa/runner'
import { ListLowStockProductsHandler } from '#kernel/product/application/query-handler/list_low_stock_products_handler'
import { ListLowStockProductsQuery } from '#kernel/product/application/query/list_low_stock_products_query'
import { StockCollection } from '#kernel/product/application/collection/stock_collection'
import { LowStockProductDto } from '#kernel/product/application/dto/stock_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Pagination } from '#shared/application/query-options/pagination'

test.group('ListLowStockProductsHandler', () => {
  const createMockLowStockProduct = (): LowStockProductDto => ({
    id: 'prod-1',
    designation: 'Low Stock Product',
    stockQuantity: 5,
    lowStockThreshold: 10,
    slug: 'low-stock-product-abc',
  })

  const createMockPaginatedResult = (): PaginatedResultDto<LowStockProductDto> => ({
    data: [createMockLowStockProduct()],
    meta: {
      currentPage: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    },
  })

  const createDefaultQuery = () => {
    return new ListLowStockProductsQuery(new Pagination(1, 10))
  }

  test('should return paginated list of low stock products', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: StockCollection = {
      getStockHistory: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listLowStockProducts: async () => mockResult,
    }

    const handler = new ListLowStockProductsHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.deepEqual(result, mockResult)
    assert.lengthOf(result.data, 1)
  })

  test('should delegate to collection.listLowStockProducts with query', async ({ assert }) => {
    let capturedQuery: ListLowStockProductsQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: StockCollection = {
      getStockHistory: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listLowStockProducts: async (query) => {
        capturedQuery = query
        return mockResult
      },
    }

    const handler = new ListLowStockProductsHandler(mockCollection)
    const query = createDefaultQuery()

    await handler.handle(query)

    assert.deepEqual(capturedQuery, query)
  })

  test('should return empty list when no low stock products', async ({ assert }) => {
    const emptyResult: PaginatedResultDto<LowStockProductDto> = {
      data: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    }

    const mockCollection: StockCollection = {
      getStockHistory: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listLowStockProducts: async () => emptyResult,
    }

    const handler = new ListLowStockProductsHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 0)
    assert.equal(result.meta.total, 0)
  })

  test('should return products with correct properties', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: StockCollection = {
      getStockHistory: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listLowStockProducts: async () => mockResult,
    }

    const handler = new ListLowStockProductsHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    const firstProduct = result.data[0]
    assert.equal(firstProduct.id, 'prod-1')
    assert.equal(firstProduct.designation, 'Low Stock Product')
    assert.equal(firstProduct.stockQuantity, 5)
    assert.equal(firstProduct.lowStockThreshold, 10)
  })
})
