import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ProductStockDto } from '#kernel/product/application/dto/stock_read_dto'
import { ProductNotFoundError } from '#kernel/product/application/errors/product_not_found_error'
import { GetProductStockQuery } from '#kernel/product/application/query/get_product_stock_query'
import { StockReadModel } from '#kernel/product/application/read-model/stock_read_model'

export class GetProductStockHandler implements QueryHandler<GetProductStockQuery, ProductStockDto> {
  constructor(private readonly repository: StockReadModel) {}

  async handle(query: GetProductStockQuery): Promise<ProductStockDto> {
    const stock = await this.repository.getProductStock(query.productId)

    if (!stock) {
      throw new ProductNotFoundError(query.productId)
    }

    return stock
  }
}
