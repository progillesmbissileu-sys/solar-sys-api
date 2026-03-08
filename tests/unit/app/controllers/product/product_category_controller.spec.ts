import { test } from '@japa/runner'
import ProductCategoryController from '#controllers/product/product_category_controller'

test.group('ProductCategoryController', () => {
  test('should have index method', ({ assert }) => {
    const controller = new ProductCategoryController()

    assert.property(controller, 'index')
    assert.typeOf(controller.index, 'function')
  })

  test('should have show method', ({ assert }) => {
    const controller = new ProductCategoryController()

    assert.property(controller, 'show')
    assert.typeOf(controller.show, 'function')
  })

  test('should have products method', ({ assert }) => {
    const controller = new ProductCategoryController()

    assert.property(controller, 'products')
    assert.typeOf(controller.products, 'function')
  })

  test('should have store method', ({ assert }) => {
    const controller = new ProductCategoryController()

    assert.property(controller, 'store')
    assert.typeOf(controller.store, 'function')
  })

  test('should have update method', ({ assert }) => {
    const controller = new ProductCategoryController()

    assert.property(controller, 'update')
    assert.typeOf(controller.update, 'function')
  })
})
