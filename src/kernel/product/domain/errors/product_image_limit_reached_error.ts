import { DomainError } from '#shared/domain/errors/domain_error'

export class ProductImageLimitReachedError extends DomainError {
  constructor(productId: string, maxImages: number) {
    super('PRODUCT_IMAGE_LIMIT_REACHED', 'Cannot add more images to this product', {
      productId,
      maxImages,
    })
  }
}
