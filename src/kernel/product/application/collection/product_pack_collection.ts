import { ProductPackDetailsDto } from '#kernel/product/application/dto/product_pack_read_dto'
import { ListProductPacksQuery } from '#kernel/product/application/query/list_product_packs_query'

export interface ProductPackCollectionResult {
  data: ProductPackDetailsDto[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
}

export interface ProductPackCollection {
  list(query: ListProductPacksQuery): Promise<ProductPackCollectionResult>
}
