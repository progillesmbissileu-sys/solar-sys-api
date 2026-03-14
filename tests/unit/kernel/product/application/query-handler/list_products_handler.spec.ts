import { test } from '@japa/runner'
import { ListProductsHandler } from '#kernel/product/application/query-handler/list_products_handler'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import { ProductListItemDto } from '#kernel/product/application/dto/product_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Sort } from '#shared/application/query-options/sort'

test.group('ListProductsHandler', () => {
  const createMockProductItem = (): ProductListItemDto => ({
    id: 'prod-1',
    slug: 'test-product-abc',
    designation: 'Test Product',
    price: 299.99,
    category: {
      id: 'cat-1',
      designation: 'Solar Panels',
    },
    mainImage: {
      url: 'https://example.com/image.jpg',
      alt: 'Product Image',
      title: 'Product Photo',
    },
    stockQuantity: 50,
    brand: 'TestBrand',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  })

  const createMockPaginatedResult = (): PaginatedResultDto<ProductListItemDto> => ({
    data: [createMockProductItem()],
    meta: {
      currentPage: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    },
  })

  const createDefaultQuery = () => {
    return new ListProductsQuery(
      new Pagination(1, 10),
      new QuerySearch(''),
      new Sort({ created_at: 'desc' })
    )
  }

  test('should return paginated list of products', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCollection = {
      list: async () => mockResult,
      listGroupedByCategory: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
    }

    const handler = new ListProductsHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.deepEqual(result, mockResult)
    assert.lengthOf(result.data, 1)
  })

  test('should delegate to collection.list with query', async ({ assert }) => {
    let capturedQuery: ListProductsQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCollection = {
      list: async (query) => {
        capturedQuery = query
        return mockResult
      },
      listGroupedByCategory: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
    }

    const handler = new ListProductsHandler(mockCollection)
    const query = createDefaultQuery()

    await handler.handle(query)

    assert.deepEqual(capturedQuery, query)
  })

  test('should return empty list when no products', async ({ assert }) => {
    const emptyResult: PaginatedResultDto<ProductListItemDto> = {
      data: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    }

    const mockCollection: ProductCollection = {
      list: async () => emptyResult,
      listGroupedByCategory: async () => emptyResult as any,
    }

    const handler = new ListProductsHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 0)
    assert.equal(result.meta.total, 0)
  })

  test('should return pagination metadata', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCollection = {
      list: async () => mockResult,
      listGroupedByCategory: async () => mockResult as any,
    }

    const handler = new ListProductsHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.equal(result.meta.currentPage, 1)
    assert.equal(result.meta.perPage, 10)
    assert.equal(result.meta.total, 1)
    assert.equal(result.meta.totalPages, 1)
  })
})
