import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListProductPacksQuery } from '#kernel/product/application/query/list_product_packs_query'
import { ProductPackCollectionResult } from '#kernel/product/application/collection/product_pack_collection'

export interface ProductPackListReadModel {
  list(query: ListProductPacksQuery): Promise<ProductPackCollectionResult>
}

export class ListProductPacksHandler implements QueryHandler<
  ListProductPacksQuery,
  ProductPackCollectionResult
> {
  constructor(private readonly productPackListReadModel: ProductPackListReadModel) {}

  async handle(query: ListProductPacksQuery): Promise<ProductPackCollectionResult> {
    return this.productPackListReadModel.list(query)
  }
}
