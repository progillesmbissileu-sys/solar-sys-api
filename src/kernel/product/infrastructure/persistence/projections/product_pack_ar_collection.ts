import {
  ProductPackDetailsDto,
  ProductPackItemDto,
} from '#kernel/product/application/dto/product_pack_read_dto'
import { ProductPackCollectionResult } from '#kernel/product/application/collection/product_pack_collection'
import { ProductPackListReadModel } from '#kernel/product/application/query-handler/list_product_packs_handler'
import { ListProductPacksQuery } from '#kernel/product/application/query/list_product_packs_query'
import { default as ProductPackActiveRecord } from '#database/active-records/product_pack'

export class ProductPackARCollection implements ProductPackListReadModel {
  async list(query: ListProductPacksQuery): Promise<ProductPackCollectionResult> {
    const page = query.pagination.page
    const limit = query.pagination.limit
    const search = query.searchQuery.search
    const sortEntries = query.order.entries

    let packQuery = ProductPackActiveRecord.query()
      .where('is_deleted', false)
      .preload('packItems', (q) => q.orderBy('sort_order', 'asc').preload('product'))
      .preload('mainImage')

    if (search) {
      packQuery = packQuery.where('designation', 'like', `%${search}%`)
    }

    // Apply sorting
    for (const [field, direction] of Object.entries(sortEntries)) {
      packQuery = packQuery.orderBy(field, direction)
    }

    const result = await packQuery.paginate(page, limit)

    const data: ProductPackDetailsDto[] = result.all().map((pack) => {
      const items: ProductPackItemDto[] = pack.packItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.designation || '',
        productSlug: item.product?.slug || '',
        productPrice: item.product?.price || 0,
        quantity: item.quantity,
        sortOrder: item.sortOrder,
        productMainImageUrl: item.product?.mainImage?.url || null,
      }))

      return {
        id: pack.id,
        designation: pack.designation,
        slug: pack.slug,
        description: pack.description,
        price: pack.price,
        mainImageUrl: pack.mainImage?.url || null,
        stockQuantity: pack.stockQuantity,
        lowStockThreshold: pack.lowStockThreshold,
        isAvailable: pack.isAvailable,
        isDeleted: pack.isDeleted,
        items,
        createdAt: pack.createdAt.toISO()!,
        updatedAt: pack.updatedAt.toISO()!,
      }
    })

    return {
      data,
      meta: {
        total: result.total,
        perPage: limit,
        currentPage: page,
        lastPage: result.lastPage,
        firstPage: result.firstPage,
      },
    }
  }
}
