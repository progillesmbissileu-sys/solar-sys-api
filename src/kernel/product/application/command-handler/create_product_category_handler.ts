import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { ProductCategoryRepository } from '#kernel/product/core/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/core/entity/product_category'
import { CreateProductCategoryCommand } from '#kernel/product/application/command/create_product_category_command'

export class CreateProductCategoryHandler implements CommandHandler<CreateProductCategoryCommand> {
  constructor(private repository: ProductCategoryRepository) {}
  handle(command: CreateProductCategoryCommand): Promise<void> {
    const category = new ProductCategory(
      null,
      command.designation,
      command.categoryType,
      command.parentId
    )
    return this.repository.save(category)
  }
}
