import { PaginatedResultDto } from '#kernel/product/application/dto/product_read_dto'
import {
  LowStockProductDto,
  ProductStockDto,
  StockMovementDto,
} from '#kernel/product/application/dto/stock_read_dto'
import { PaginatedQueryOptions } from '#shared/application/query-options/paginated_query_options'

export interface StockHistoryQueryOptions extends PaginatedQueryOptions {
  productId: string
}

export interface StockReadRepository {
  getProductStock(productId: string): Promise<ProductStockDto | null>
  getStockHistory(params: StockHistoryQueryOptions): Promise<PaginatedResultDto<StockMovementDto>>
  listLowStockProducts(params: PaginatedQueryOptions): Promise<PaginatedResultDto<LowStockProductDto>>
}
