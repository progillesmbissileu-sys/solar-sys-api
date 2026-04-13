import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ProductModifierDetailsDto } from '#kernel/product/application/dto/product_modifier_read_dto'
import { GetProductModifierQuery } from '#kernel/product/application/query/get_product_modifier_query'
import { ProductModifierReadModel } from '#kernel/product/application/read-model/product_modifier_read_model'

export class GetProductModifierHandler implements QueryHandler<GetProductModifierQuery, ProductModifierDetailsDto> {
  constructor(private readonly productModifierReadModel: ProductModifierReadModel) {}

  async handle(query: GetProductModifierQuery): Promise<ProductModifierDetailsDto> {
    const modifier = await this.productModifierReadModel.getById(query.id)

    if (!modifier) {
      throw new Error(`ProductModifier with id ${query.id} not found`)
    }

    return modifier
  }
}
