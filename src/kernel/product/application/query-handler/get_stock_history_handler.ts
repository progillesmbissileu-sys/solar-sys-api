import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetStockHistoryQuery } from '../queries/get_stock_history_query'
import { PaginatedResultDto } from '../dto/product_read_dto'
import { StockMovementDto } from '../dto/stock_read_dto'
import { StockReadRepository } from '../services/stock_read_repository'

export class GetStockHistoryHandler implements QueryHandler<
  GetStockHistoryQuery,
  PaginatedResultDto<StockMovementDto>
> {
  constructor(private readonly repository: StockReadRepository) {}

  async handle(query: GetStockHistoryQuery): Promise<PaginatedResultDto<StockMovementDto>> {
    return this.repository.getStockHistory({
      productId: query.productId,
      page: query.page,
      limit: query.limit,
    })
  }
}
