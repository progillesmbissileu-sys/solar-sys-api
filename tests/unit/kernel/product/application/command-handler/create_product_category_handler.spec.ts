import { test } from '@japa/runner'
import { CreateProductCategoryHandler } from '#kernel/product/application/command-handler/create_product_category_handler'
import { CreateProductCategoryCommand } from '#kernel/product/application/command/create_product_category_command'
import { ProductCategoryRepository } from '#kernel/product/domain/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'

test.group('CreateProductCategoryHandler', () => {
  test('should create category with valid command data', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductCategoryHandler(mockRepository)
    const command = new CreateProductCategoryCommand('Solar Panels', 'CATEGORY', null)

    await handler.handle(command)

    assert.isDefined(savedCategory)
    assert.equal(savedCategory!.getDesignation(), 'Solar Panels')
    assert.equal(savedCategory!.getType(), 'CATEGORY')
    assert.equal(savedCategory!.getParentId(), null)
  })

  test('should call repository.save with correct category entity', async ({ assert }) => {
    let saveCalled = false

    const mockRepository: ProductCategoryRepository = {
      save: async () => {
        saveCalled = true
      },
      find: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductCategoryHandler(mockRepository)
    const command = new CreateProductCategoryCommand('Test Category', 'CATEGORY')

    await handler.handle(command)

    assert.isTrue(saveCalled)
  })

  test('should create category with TAG type', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductCategoryHandler(mockRepository)
    const command = new CreateProductCategoryCommand('Eco-Friendly', 'TAG')

    await handler.handle(command)

    assert.equal(savedCategory!.getType(), 'TAG')
  })

  test('should create category with parentId for nested categories', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductCategoryHandler(mockRepository)
    const command = new CreateProductCategoryCommand('Monocrystalline', 'CATEGORY', 'parent-cat-1')

    await handler.handle(command)

    assert.equal(savedCategory!.getParentId(), 'parent-cat-1')
  })

  test('should create category with null id (new entity)', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductCategoryHandler(mockRepository)
    const command = new CreateProductCategoryCommand('New Category', 'CATEGORY')

    await handler.handle(command)

    assert.isNull(savedCategory!.getId())
  })
})
