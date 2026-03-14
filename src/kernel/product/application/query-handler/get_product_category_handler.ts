import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ProductCategoryDetailsDto } from '#kernel/product/application/dto/product_category_read_dto'
import { GetProductCategoryQuery } from '#kernel/product/application/query/get_product_category_query'
import { ProductCategoryReadModel } from '#kernel/product/application/read-model/product_category_read_model'
import { ProductCategoryNotFoundError } from '#kernel/product/application/errors/product_category_not_found_error'

export class GetProductCategoryHandler implements QueryHandler<
  GetProductCategoryQuery,
  ProductCategoryDetailsDto
> {
  constructor(private readonly repository: ProductCategoryReadModel) {}

  async handle(query: GetProductCategoryQuery): Promise<ProductCategoryDetailsDto> {
    const category = await this.repository.getById(query.categoryId)

    if (!category) {
      throw new ProductCategoryNotFoundError(query.categoryId)
    }

    return category
  }
}
