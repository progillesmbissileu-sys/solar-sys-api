import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'

export class ProductCategoryNotFoundError extends NotFoundApplicationError {
  constructor(categoryId: string, cause?: unknown) {
    super('Product category not found', { resource: 'product_category', categoryId }, cause)
  }
}
