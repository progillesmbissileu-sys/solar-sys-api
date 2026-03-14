import { test } from '@japa/runner'
import { CreateProductPackHandler } from '#kernel/product/application/command-handler/create_product_pack_handler'
import { CreateProductPackCommand } from '#kernel/product/application/command/create_product_pack_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'

test.group('CreateProductPackHandler', () => {
  const PROD_1 = '00000000-0000-4000-8000-0000000000b1'
  const PROD_2 = '00000000-0000-4000-8000-0000000000b2'
  const MAIN_IMG_1 = '00000000-0000-4000-8000-000000000111'

  test('should create product pack and call repository.save', async ({ assert }) => {
    let savedPack: ProductPack | null = null

    const mockRepository: ProductPackRepository = {
      save: async (pack: ProductPack) => {
        savedPack = pack
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductPackHandler(mockRepository)
    const command = new CreateProductPackCommand(
      'Starter Pack',
      199.99,
      [
        { productId: PROD_1, quantity: 2 },
        { productId: PROD_2, quantity: 1 },
      ],
      'Bundle description',
      MAIN_IMG_1,
      20,
      5
    )

    await handler.handle(command)

    assert.isDefined(savedPack)
    assert.equal(savedPack!.getDesignation(), 'Starter Pack')
    assert.equal(savedPack!.getPrice(), 199.99)
    assert.equal(savedPack!.getDescription(), 'Bundle description')
    assert.equal(savedPack!.getMainImage()!.id.value, MAIN_IMG_1)
    assert.equal(savedPack!.getStockQuantity(), 20)
    assert.equal(savedPack!.getLowStockThreshold(), 5)
  })

  test('should deduplicate items by productId and filter out non-positive quantities', async ({
    assert,
  }) => {
    let savedPack: ProductPack | null = null

    const mockRepository: ProductPackRepository = {
      save: async (pack: ProductPack) => {
        savedPack = pack
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductPackHandler(mockRepository)
    const command = new CreateProductPackCommand('Pack', 100, [
      { productId: PROD_1, quantity: 2 },
      { productId: PROD_1, quantity: 5 }, // should be ignored due to uniqBy(productId)
      { productId: PROD_2, quantity: 0 }, // should be filtered out
    ])

    await handler.handle(command)

    const items = savedPack!.getItems()
    assert.lengthOf(items, 1)
    assert.equal(items[0].getProductId().value, PROD_1)
    assert.equal(items[0].getQuantity(), 2)
    assert.equal(items[0].getSortOrder(), 0)
  })

  test('should set mainImage to null when mainImageId not provided', async ({ assert }) => {
    let savedPack: ProductPack | null = null

    const mockRepository: ProductPackRepository = {
      save: async (pack: ProductPack) => {
        savedPack = pack
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductPackHandler(mockRepository)
    const command = new CreateProductPackCommand('Pack', 100, [{ productId: PROD_1, quantity: 1 }])

    await handler.handle(command)

    assert.isNull(savedPack!.getMainImage())
  })
})
