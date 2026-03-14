import { RepositoryInterface } from '#shared/infrastructure/repository_interface'

export interface ProductImageRepository extends RepositoryInterface {
  addImage(productId: string, imageId: string, isMainImage: boolean): Promise<void>
  removeImage(productId: string, imageId: string): Promise<void>
  countImages(productId: string): Promise<number>
  hasMainImage(productId: string): Promise<boolean>
  isImageOwnedByProduct(productId: string, imageId: string): Promise<boolean>
}
