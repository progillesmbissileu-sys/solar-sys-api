import { test } from '@japa/runner'
import { ListProductCategoriesHandler } from '#kernel/product/application/query-handler/list_product_categories_handler'
import { ListProductCategoriesQuery } from '#kernel/product/application/query/list_product_categories_query'
import { ProductCategoryCollection } from '#kernel/product/application/collection/product_category_collection'
import { ProductCategoryListItemDto } from '#kernel/product/application/dto/product_category_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'

test.group('ListProductCategoriesHandler', () => {
  const createMockCategoryItem = (): ProductCategoryListItemDto => ({
    id: 'cat-1',
    designation: 'Solar Panels',
    slug: 'solar-panels-abc',
    type: 'CATEGORY',
    parentId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  })

  const createMockPaginatedResult = (): PaginatedResultDto<ProductCategoryListItemDto> => ({
    data: [createMockCategoryItem()],
    meta: {
      currentPage: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
    },
  })

  const createDefaultQuery = () => {
    return new ListProductCategoriesQuery(new Pagination(1, 10), new QuerySearch(''))
  }

  test('should return paginated list of categories', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCategoryCollection = {
      list: async () => mockResult,
      listProducts: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
    }

    const handler = new ListProductCategoriesHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.deepEqual(result, mockResult)
    assert.lengthOf(result.data, 1)
  })

  test('should delegate to collection.list with query', async ({ assert }) => {
    let capturedQuery: ListProductCategoriesQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCategoryCollection = {
      list: async (query) => {
        capturedQuery = query
        return mockResult
      },
      listProducts: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
    }

    const handler = new ListProductCategoriesHandler(mockCollection)
    const query = createDefaultQuery()

    await handler.handle(query)

    assert.deepEqual(capturedQuery, query)
  })

  test('should return empty list when no categories', async ({ assert }) => {
    const emptyResult: PaginatedResultDto<ProductCategoryListItemDto> = {
      data: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    }

    const mockCollection: ProductCategoryCollection = {
      list: async () => emptyResult,
      listProducts: async () => emptyResult as any,
    }

    const handler = new ListProductCategoriesHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 0)
    assert.equal(result.meta.total, 0)
  })

  test('should return categories with correct properties', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: ProductCategoryCollection = {
      list: async () => mockResult,
      listProducts: async () => ({
        data: [],
        meta: { currentPage: 1, perPage: 10, total: 0, totalPages: 0 },
      }),
    }

    const handler = new ListProductCategoriesHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    const firstCategory = result.data[0]
    assert.equal(firstCategory.id, 'cat-1')
    assert.equal(firstCategory.designation, 'Solar Panels')
    assert.equal(firstCategory.type, 'CATEGORY')
    assert.equal(firstCategory.parentId, null)
  })
})
