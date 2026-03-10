import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { default as EntityActiveRecord } from '#database/active-records/product_pack'
import ProductPackItemActiveRecord from '#database/active-records/product_pack_item'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import crypto from 'node:crypto'
import { ProductPackNotFoundError } from '#kernel/product/domain/errors/product_pack_not_found_error'
import { errors } from '@adonisjs/lucid'

export class ProductPackARRepository implements ProductPackRepository {
  async find(id: any): Promise<ProductPack> {
    let pack: EntityActiveRecord

    try {
      pack = await EntityActiveRecord.query()
        .where('id', id)
        .where('is_deleted', false)
        .preload('packItems', (query) => query.orderBy('sort_order', 'asc').preload('product'))
        .preload('mainImage')
        .firstOrFail()
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        throw new ProductPackNotFoundError(String(id), error)
      }
      throw error
    }

    const items = pack.packItems.map((item) => {
      let product: Product | undefined
      if (item.product) {
        product = new Product(
          item.product.id,
          item.product.designation,
          new ProductCategory(item.product.categoryId, ''),
          item.product.description,
          item.product.price,
          new ProductImage(item.product.mainImageId, item.product.mainImage?.url || null),
          [],
          item.product.slug,
          item.product.brand,
          item.product.stockQuantity,
          item.product.lowStockThreshold,
          item.product.isAvailable,
          item.product.isDeleted,
          item.product.createdAt as any,
          item.product.updatedAt as any
        )
      }
      return new ProductPackItem(item.productId, item.quantity, product, item.sortOrder)
    })

    const mainImage = pack.mainImageId
      ? new ProductImage(pack.mainImageId, pack.mainImage?.url || null)
      : null

    return new ProductPack(
      pack.id,
      pack.designation,
      pack.description,
      pack.price,
      mainImage,
      items,
      pack.slug,
      pack.stockQuantity,
      pack.lowStockThreshold,
      pack.isAvailable,
      pack.isDeleted,
      pack.createdAt as any,
      pack.updatedAt as any
    )
  }

  async save(entity: ProductPack): Promise<void> {
    const object = {
      id: entity.getId() as crypto.UUID,
      designation: entity.getDesignation(),
      description: entity.getDescription(),
      price: entity.getPrice(),
      mainImageId: entity.getMainImage()?.id as crypto.UUID | null,
      slug: entity.getSlug() as string,
      stockQuantity: entity.getStockQuantity(),
      lowStockThreshold: entity.getLowStockThreshold(),
      isAvailable: entity.getIsAvailable(),
      isDeleted: entity.getIsDeleted(),
    }

    let packRecord: EntityActiveRecord

    if (entity.getId()) {
      packRecord = await EntityActiveRecord.updateOrCreate({ id: entity.getId() }, object)
    } else {
      packRecord = await EntityActiveRecord.create(object)
    }

    // Handle pack items
    const items = entity.getItems()
    if (items.length > 0) {
      // Delete existing items
      await ProductPackItemActiveRecord.query().where('pack_id', packRecord.id).delete()

      // Insert new items
      for (const item of items) {
        await ProductPackItemActiveRecord.create({
          packId: packRecord.id,
          productId: item.getProductId() as crypto.UUID,
          quantity: item.getQuantity(),
          sortOrder: item.getSortOrder(),
        })
      }
    }
  }

  async delete(id: any): Promise<void> {
    const pack = await EntityActiveRecord.findOrFail(id)
    pack.isDeleted = true
    await pack.save()
  }
}
