import { test } from '@japa/runner'
import { ListProductsByCategoryHandler } from '#kernel/product/application/query-handler/list_products_by_category_handler'
import { ListProductsByCategoryQuery } from '#kernel/product/application/query/list_products_by_category_query'
import { ProductCategoryCollection } from '#kernel/product/application/collection/product_category_collection'
import { CategoryProductListItemDto } from '#kernel/product/application/dto/product_category_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Sort } from '#shared/application/query-options/sort'

test.group('ListProductsByCategoryHandler', () => {
  const createMockProductItem = (): CategoryProductListItemDto => ({
    id: 'prod-1',
    slug: 'test-product-abc',
    designation: 'Test Product',
    price: 299.99,
    categoryName: 'Solar Panels',
    categoryId: 'cat-1',
    pictureUrl: 'https://example.com/image.jpg',
    brand: 'TestBrand',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  })

  const createMockPaginatedResult = (): PaginatedResultDto<CategoryProductListItemDto> => ({
    data: [createMockProductItem()],
    meta: {
      currentPage: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    },
  })

  const createDefaultQuery = () => {
    return new ListProductsByCategoryQuery(
      'cat-1',
      new Pagination(1, 10),
      new QuerySearch(''),
      new Sort({ created_at: 'desc' })
    )
  }

  test('should return products filtered by category', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCategoryCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listProducts: async () => mockResult,
    }

    const handler = new ListProductsByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.deepEqual(result, mockResult)
    assert.lengthOf(result.data, 1)
  })

  test('should delegate to collection.listProducts with query', async ({ assert }) => {
    let capturedQuery: ListProductsByCategoryQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCategoryCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listProducts: async (query) => {
        capturedQuery = query
        return mockResult
      },
    }

    const handler = new ListProductsByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    await handler.handle(query)

    assert.deepEqual(capturedQuery, query)
  })

  test('should return empty list when no products in category', async ({ assert }) => {
    const emptyResult: PaginatedResultDto<CategoryProductListItemDto> = {
      data: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    }

    const mockCollection: ProductCategoryCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listProducts: async () => emptyResult,
    }

    const handler = new ListProductsByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 0)
    assert.equal(result.meta.total, 0)
  })

  test('should include categoryId in query', async ({ assert }) => {
    let capturedCategoryId: string | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCategoryCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listProducts: async (query) => {
        capturedCategoryId = query.categoryId
        return mockResult
      },
    }

    const handler = new ListProductsByCategoryHandler(mockCollection)
    const query = new ListProductsByCategoryQuery(
      'cat-456',
      new Pagination(1, 10),
      new QuerySearch(''),
      new Sort({ created_at: 'desc' })
    )

    await handler.handle(query)

    assert.equal(capturedCategoryId, 'cat-456')
  })
})
