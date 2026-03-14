import { test } from '@japa/runner'
import { RemoveProductPackItemHandler } from '#kernel/product/application/command-handler/remove_product_pack_item_handler'
import { RemoveProductPackItemCommand } from '#kernel/product/application/command/remove_product_pack_item'
import { ProductPackItemRepository } from '#kernel/product/domain/repository/product_pack_item_repository'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { AppId } from '#shared/domain/app_id'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'

test.group('RemoveProductPackItemHandler', () => {
  const ITEM_1 = '00000000-0000-4000-8000-0000000000d1'
  const PROD_1 = '00000000-0000-4000-8000-0000000000b1'

  test('should delete pack item when found', async ({ assert }) => {
    let deleteCalled = false
    let deletedId: AppId | null = null

    const mockRepository: ProductPackItemRepository = {
      find: async () =>
        new ProductPackItem(AppId.fromString(ITEM_1), AppId.fromString(PROD_1), 1, undefined, 0),
      delete: async (id: AppId) => {
        deleteCalled = true
        deletedId = id
      },
    }

    const packMockRepository: ProductPackRepository = {
      find: async () => null,
      delete: async () => {
        throw new Error('Should not be called')
      },
      save: async () => {
        throw new Error('Should not be called')
      },
    }

    const handler = new RemoveProductPackItemHandler(mockRepository, packMockRepository)
    await handler.handle(new RemoveProductPackItemCommand(AppId.fromString(ITEM_1)))

    assert.isTrue(deleteCalled)
    assert.equal(deletedId!.value, ITEM_1)
  })

  test('should throw NotFoundApplicationError when item does not exist', async ({ assert }) => {
    const mockRepository: ProductPackItemRepository = {
      find: async () => null,
      delete: async () => {
        throw new Error('Should not be called')
      },
    }

    const packMockRepository: ProductPackRepository = {
      find: async () => null,
      delete: async () => {
        throw new Error('Should not be called')
      },
      save: async () => {
        throw new Error('Should not be called')
      },
    }

    const handler = new RemoveProductPackItemHandler(mockRepository, packMockRepository)

    try {
      await handler.handle(new RemoveProductPackItemCommand(AppId.fromString(ITEM_1)))
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.instanceOf(error, NotFoundApplicationError)
      assert.equal(
        (error as NotFoundApplicationError).message,
        `Product pack item with id ${ITEM_1} not found`
      )
    }
  })
})
