import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { default as EntityActiveRecord } from '#database/active-records/product'
import { Product } from '#kernel/product/domain/entity/product'

export class ProductARRepository implements ProductRepository {
  async findById(id: any): Promise<Product> {
    const product = await EntityActiveRecord.findOrFail(id)

    return new Product(
      product.id,
      product.designation,
      product.pictureId,
      product.categoryId,
      product.description,
      product.price,
      product.brand,
      product.slug,
      product.isAvailable,
      product.isDeleted,
      product.createdAt as any,
      product.updatedAt as any,
      product.picture?.url,
      product.category?.designation
    )
  }

  async save(entity: Product): Promise<void> {
    const object = {
      id: entity['id'],
      designation: entity['designation'],
      pictureId: entity['pictureId'],
      categoryId: entity['categoryId'],
      description: entity['description'],
      price: entity['price'],
      brand: entity['brand'],
      slug: entity['slug'] as any,
      isAvailable: entity['isAvailable'],
      isDeleted: entity['isDeleted'],
    }

    entity.getId()
      ? await EntityActiveRecord.updateOrCreate({ id: entity.getId() }, object)
      : await EntityActiveRecord.create(object)
  }

  async delete(id: any): Promise<void> {
    const product = await EntityActiveRecord.findOrFail(id)
    await product.delete()
  }
}
