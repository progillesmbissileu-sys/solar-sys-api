import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ProductPackDetailsDto } from '#kernel/product/application/dto/product_pack_read_dto'
import { GetProductPackQuery } from '#kernel/product/application/query/get_product_pack_query'
import { ProductPackNotFoundError } from '#kernel/product/domain/errors/product_pack_not_found_error'

export interface ProductPackReadModelContract {
  getById(packId: string): Promise<ProductPackDetailsDto | null>
}

export class GetProductPackHandler implements QueryHandler<
  GetProductPackQuery,
  ProductPackDetailsDto
> {
  constructor(private readonly productPackReadModel: ProductPackReadModelContract) {}

  async handle(query: GetProductPackQuery): Promise<ProductPackDetailsDto> {
    const pack = await this.productPackReadModel.getById(query.packId)

    if (!pack) {
      throw new ProductPackNotFoundError(query.packId)
    }

    return pack
  }
}
