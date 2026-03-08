import Product from '#database/active-records/product'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import {
  GroupedProductsByCategoryDto,
  ProductListItemDto,
} from '#kernel/product/application/dto/product_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/query/list_products_grouped_by_category_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

type ProductActiveRecordWithRelations = Product & {
  mainImage?: {
    id?: string
    relativeKey?: string
    relative_key?: string
    altDescription?: string
    title?: string
  } | null
  images?: Array<{
    id: string
    relativeKey?: string
    relative_key?: string
    altDescription?: string
    title?: string
  }>
  category?: {
    id?: string
    designation?: string
  } | null
}

export class ProductARCollection extends ModelQueryBuilderHelper implements ProductCollection {
  constructor(private readonly mediaManager: MediaManagerInterface) {
    super()
  }

  async list(query: ListProductsQuery): Promise<PaginatedResultDto<ProductListItemDto>> {
    let queryBuilder = Product.query()

    this.withRelation(['category', 'mainImage'], queryBuilder)
    queryBuilder.whereILike('designation', `%${query.searchQuery.search}%`)
    this.applySort(query.order, ['created_at', 'price'], queryBuilder)

    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<ProductActiveRecordWithRelations, ProductListItemDto>(
      result as any,
      async (product) => {
        const mainImageUrl = await this.getSignedUrl(
          product.mainImage?.relativeKey || product.mainImage?.relative_key
        )

        return {
          id: product.id,
          slug: product.slug,
          designation: product.designation,
          price: product.price,
          category: {
            designation: product.category?.designation ?? null,
            id: product.category?.id ?? null,
          },
          mainImage: {
            url: mainImageUrl,
            alt: product.mainImage?.altDescription ?? null,
            title: product.mainImage?.title ?? null,
          },
          stockQuantity: product.stockQuantity,
          brand: product.brand ?? null,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      }
    )
  }

  async listGroupedByCategory(
    query: ListProductsGroupedByCategoryQuery
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>> {
    // Step 1: Build the base query with search filter
    let queryBuilder = Product.query()
    this.withRelation(['category', 'mainImage'], queryBuilder)
    queryBuilder.whereILike('designation', `%${query.searchQuery.search}%`)
    this.applySort(query.order, ['created_at', 'price'], queryBuilder)

    // Step 2: Paginate the filtered products
    const paginatedProducts = await queryBuilder.paginate(
      query.pagination.page,
      query.pagination.limit
    )

    const productsPage = paginatedProducts.toJSON()
    const products = productsPage.data as ProductActiveRecordWithRelations[]

    // Step 3: Map products to DTOs with signed URLs
    const mappedProducts = await Promise.all(
      products.map(async (product) => ({
        id: product.id,
        slug: product.slug,
        designation: product.designation,
        price: product.price,
        categoryName: product.category?.designation ?? null,
        categoryId: product.category?.id ?? null,
        mainImageUrl: await this.getSignedUrl(
          product.mainImage?.relativeKey || product.mainImage?.relative_key
        ),
        brand: product.brand ?? null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }))
    )

    // Step 4: Group the paginated products by category
    const grouped = mappedProducts.reduce(
      (acc, product) => {
        const categoryId = product.categoryId || 'uncategorized'
        const categoryName = product.categoryName || 'Uncategorized'

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName,
            products: [],
          }
        }

        acc[categoryId].products.push(product)
        return acc
      },
      {} as Record<string, GroupedProductsByCategoryDto>
    )

    // Step 5: Return with product-based pagination metadata
    return {
      meta: productsPage.meta,
      data: Object.values(grouped),
    }
  }

  private async getSignedUrl(relativeKey?: string | null): Promise<string | null> {
    if (!relativeKey) {
      return null
    }

    return this.mediaManager.getSignedUrl(relativeKey)
  }
}
