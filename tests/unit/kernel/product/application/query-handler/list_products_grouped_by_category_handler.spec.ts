import { test } from '@japa/runner'
import { ListProductsGroupedByCategoryHandler } from '#kernel/product/application/query-handler/list_products_grouped_by_category_handler'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/query/list_products_grouped_by_category_query'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import { GroupedProductsByCategoryDto } from '#kernel/product/application/dto/product_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Sort } from '#shared/application/query-options/sort'

test.group('ListProductsGroupedByCategoryHandler', () => {
  const createMockGroupedProduct = (): GroupedProductsByCategoryDto => ({
    categoryId: 'cat-1',
    categoryName: 'Solar Panels',
    products: [
      {
        id: 'prod-1',
        slug: 'test-product-abc',
        designation: 'Test Product',
        price: 299.99,
        categoryName: 'Solar Panels',
        categoryId: 'cat-1',
        mainImageUrl: 'https://example.com/image.jpg',
        brand: 'TestBrand',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      },
    ],
  })

  const createMockPaginatedResult = (): PaginatedResultDto<GroupedProductsByCategoryDto> => ({
    data: [createMockGroupedProduct()],
    meta: {
      currentPage: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    },
  })

  const createDefaultQuery = () => {
    return new ListProductsGroupedByCategoryQuery(
      new Pagination(1, 10),
      new QuerySearch(''),
      new Sort({ created_at: 'desc' })
    )
  }

  test('should return products grouped by category', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listGroupedByCategory: async () => mockResult,
    }

    const handler = new ListProductsGroupedByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.deepEqual(result, mockResult)
    assert.lengthOf(result.data, 1)
  })

  test('should delegate to collection.listGroupedByCategory with query', async ({ assert }) => {
    let capturedQuery: ListProductsGroupedByCategoryQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listGroupedByCategory: async (query) => {
        capturedQuery = query
        return mockResult
      },
    }

    const handler = new ListProductsGroupedByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    await handler.handle(query)

    assert.deepEqual(capturedQuery, query)
  })

  test('should return GroupedProductsByCategoryDto structure', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listGroupedByCategory: async () => mockResult,
    }

    const handler = new ListProductsGroupedByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    const firstGroup = result.data[0]
    assert.equal(firstGroup.categoryId, 'cat-1')
    assert.equal(firstGroup.categoryName, 'Solar Panels')
    assert.lengthOf(firstGroup.products, 1)
    assert.equal(firstGroup.products[0].designation, 'Test Product')
  })

  test('should return empty list when no products', async ({ assert }) => {
    const emptyResult: PaginatedResultDto<GroupedProductsByCategoryDto> = {
      data: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    }

    const mockCollection: ProductCollection = {
      list: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
      listGroupedByCategory: async () => emptyResult,
    }

    const handler = new ListProductsGroupedByCategoryHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 0)
    assert.equal(result.meta.total, 0)
  })
})
