import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'

export class ProductNotFoundError extends NotFoundApplicationError {
  constructor(productId: string, cause?: unknown) {
    super('Product not found', { resource: 'product', productId }, cause)
  }
}
