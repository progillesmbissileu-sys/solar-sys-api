import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { StoreDetailsDto } from '#kernel/store/application/dto/store_dto'
import { GetStoreQuery } from '../query/get_store_query'
import { StoreReadModel } from '../read_model/store_read_model'

export class GetStoreQueryHandler implements QueryHandler<GetStoreQuery, StoreDetailsDto> {
  constructor(private readonly readModelService: StoreReadModel) {}

  handle(query: GetStoreQuery): Promise<StoreDetailsDto> {
    return this.readModelService.storeById(query.storeId)
  }
}
