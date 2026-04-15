import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ProductModifierGroupDetailsDto } from '#kernel/product/application/dto/product_modifier_read_dto'
import { GetProductModifierGroupQuery } from '#kernel/product/application/query/get_product_modifier_group_query'
import { ProductModifierGroupReadModel } from '#kernel/product/application/read-model/product_modifier_group_read_model'
import { ProductModifierGroupNotFoundError } from '#kernel/product/application/errors/product_modifier_group_not_found_error'

export class GetProductModifierGroupHandler implements QueryHandler<GetProductModifierGroupQuery, ProductModifierGroupDetailsDto> {
  constructor(private readonly readModel: ProductModifierGroupReadModel) {}

  async handle(query: GetProductModifierGroupQuery): Promise<ProductModifierGroupDetailsDto> {
    const group = await this.readModel.getById(query.id)

    if (!group) {
      throw new ProductModifierGroupNotFoundError(query.id)
    }

    return group
  }
}
