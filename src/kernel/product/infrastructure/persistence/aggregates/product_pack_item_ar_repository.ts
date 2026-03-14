import { default as EntityActiveRecord } from '#database/active-records/product_pack_item'
import { AppId } from '#shared/domain/app_id'
import { ProductPackItemRepository } from '#kernel/product/domain/repository/product_pack_item_repository'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'

export class ProductPackItemARRepository implements ProductPackItemRepository {
  async find(id: AppId): Promise<ProductPackItem | null> {
    const packItem = await EntityActiveRecord.findOrFail(id.value)

    return packItem
      ? new ProductPackItem(
          AppId.fromString(packItem.id),
          AppId.fromString(packItem.productId),
          packItem.quantity,
          AppId.fromString(packItem.packId)
        )
      : null
  }

  async delete(id: AppId): Promise<void> {
    await EntityActiveRecord.query().where('id', id.value).delete()
  }
}
