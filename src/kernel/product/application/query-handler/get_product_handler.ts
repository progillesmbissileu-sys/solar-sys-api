import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ProductDetailsDto } from '#kernel/product/application/dto/product_read_dto'
import { GetProductQuery } from '#kernel/product/application/query/get_product_query'
import { ProductReadModel } from '#kernel/product/application/read-model/product_read_model'
import { ProductNotFoundError } from '#kernel/product/application/errors/product_not_found_error'

export class GetProductHandler implements QueryHandler<GetProductQuery, ProductDetailsDto> {
  constructor(private readonly productReadRepository: ProductReadModel) {}

  async handle(query: GetProductQuery): Promise<ProductDetailsDto> {
    const product = await this.productReadRepository.getById(query.productId)

    if (!product) {
      throw new ProductNotFoundError(query.productId)
    }

    return product
  }
}
