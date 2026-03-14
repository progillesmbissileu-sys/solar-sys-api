import { test } from '@japa/runner'
import { UpdateProductPackHandler } from '#kernel/product/application/command-handler/update_product_pack_handler'
import { UpdateProductPackCommand } from '#kernel/product/application/command/update_product_pack_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'

test.group('UpdateProductPackHandler', () => {
  const PACK_1 = '00000000-0000-4000-8000-0000000000a1'
  const PROD_1 = '00000000-0000-4000-8000-0000000000b1'
  const PROD_2 = '00000000-0000-4000-8000-0000000000b2'
  const MAIN_IMG_1 = '00000000-0000-4000-8000-000000000111'
  const MAIN_IMG_2 = '00000000-0000-4000-8000-000000000222'

  const createExistingPack = () => {
    return new ProductPack(
      AppId.fromString(PACK_1),
      'Old Pack',
      'Old description',
      100,
      new ProductImage(AppId.fromString(MAIN_IMG_1), 'https://example.com/old.jpg'),
      [new ProductPackItem(null, AppId.fromString(PROD_1), 1, undefined, 0)],
      'old-pack-slug',
      15,
      10,
      true,
      false,
      new Date('2024-01-01'),
      new Date('2024-01-15')
    )
  }

  test('should fetch existing pack from repository', async ({ assert }) => {
    let findCalled = false
    const existingPack = createExistingPack()

    const mockRepository: ProductPackRepository = {
      save: async () => {},
      find: async (id) => {
        findCalled = true
        assert.equal(id.value, PACK_1)
        return existingPack
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductPackHandler(mockRepository)
    const command = new UpdateProductPackCommand(AppId.fromString(PACK_1), 'New Pack', 200, [])

    await handler.handle(command)

    assert.isTrue(findCalled)
  })

  test('should update designation, description, price, mainImage, items, and preserve immutable fields', async ({
    assert,
  }) => {
    let savedPack: ProductPack | null = null
    const existingPack = createExistingPack()

    const mockRepository: ProductPackRepository = {
      save: async (pack: ProductPack) => {
        savedPack = pack
      },
      find: async () => existingPack,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductPackHandler(mockRepository)
    const command = new UpdateProductPackCommand(
      AppId.fromString(PACK_1),
      'Updated Pack',
      299.99,
      [
        { productId: PROD_1, quantity: 2 },
        { productId: PROD_2, quantity: 1 },
      ],
      'Updated description',
      MAIN_IMG_2,
      3
    )

    await handler.handle(command)

    assert.equal(savedPack!.getId()!.value, PACK_1)
    assert.equal(savedPack!.getDesignation(), 'Updated Pack')
    assert.equal(savedPack!.getDescription(), 'Updated description')
    assert.equal(savedPack!.getPrice(), 299.99)
    assert.equal(savedPack!.getMainImage()!.id.value, MAIN_IMG_2)

    // Preserved from existing pack
    assert.equal(savedPack!.getSlug(), 'old-pack-slug')
    assert.equal(savedPack!.getStockQuantity(), 15)
    assert.equal(savedPack!.getIsAvailable(), true)
    assert.equal(savedPack!.getIsDeleted(), false)
    assert.deepEqual(savedPack!.getCreatedAt(), new Date('2024-01-01'))

    // UpdatedAt is set to "now" by handler
    assert.isDefined(savedPack!.getUpdatedAt())

    const items = savedPack!.getItems()
    assert.lengthOf(items, 2)
    assert.equal(items[0].getProductId().value, PROD_1)
    assert.equal(items[0].getQuantity(), 2)
    assert.equal(items[0].getSortOrder(), 0)
    assert.equal(items[1].getProductId().value, PROD_2)
    assert.equal(items[1].getQuantity(), 1)
    assert.equal(items[1].getSortOrder(), 1)

    // lowStockThreshold comes from command when provided
    assert.equal(savedPack!.getLowStockThreshold(), 3)
  })

  test('should preserve lowStockThreshold when not provided', async ({ assert }) => {
    let savedPack: ProductPack | null = null
    const existingPack = createExistingPack()

    const mockRepository: ProductPackRepository = {
      save: async (pack: ProductPack) => {
        savedPack = pack
      },
      find: async () => existingPack,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductPackHandler(mockRepository)
    const command = new UpdateProductPackCommand(
      AppId.fromString(PACK_1),
      'Updated Pack',
      299.99,
      [{ productId: PROD_1, quantity: 1 }],
      undefined,
      undefined,
      undefined
    )

    await handler.handle(command)

    assert.equal(savedPack!.getLowStockThreshold(), 10)
  })
})
