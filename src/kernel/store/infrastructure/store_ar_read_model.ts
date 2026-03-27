import { StoreReadModel } from '#kernel/store/application/read_model/store_read_model'
import { StoreDetailsDto } from '#kernel/store/application/dto/store_dto'

export class StoreARReadModel implements StoreReadModel {
  async storeById(storeId: string): Promise<StoreDetailsDto> {
    throw new Error('Method not implemented.')
  }
}
