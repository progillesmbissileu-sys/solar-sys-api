import { ProductRepository } from '#kernel/product/core/repository/product_repository'
import { default as ProductActiveRecord } from '#database/active-records/product'
import { Product } from '#kernel/product/core/entity/product'

export class ProductARRepository implements ProductRepository {
  async findById(id: any): Promise<Product> {
    const product = await ProductActiveRecord.findOrFail(id)

    return new Product(
      product.id,
      product.designation,
      product.categoryId,
      product.description,
      product.pictureUrl,
      product.price,
      product.brand,
      product.slug,
      product.isAvailable,
      product.isDeleted,
      product.createdAt as any,
      product.updatedAt as any
    )
  }

  async save(entity: Product): Promise<void> {
    const object = {
      id: entity['id'],
      designation: entity['designation'],
      categoryId: entity['categoryId'],
      description: entity['description'],
      pictureUrl: entity['pictureUrl'],
      price: entity['price'],
      brand: entity['brand'],
      slug: entity['slug'] as any,
      isAvailable: entity['isAvailable'],
      isDeleted: entity['isDeleted'],
      createdAt: entity['createdAt'] as any,
    }

    entity.getId()
      ? await ProductActiveRecord.updateOrCreate({ id: entity.getId() }, object)
      : await ProductActiveRecord.create(object)
  }

  async delete(id: any): Promise<void> {
    const product = await ProductActiveRecord.findOrFail(id)
    await product.delete()
  }
}
