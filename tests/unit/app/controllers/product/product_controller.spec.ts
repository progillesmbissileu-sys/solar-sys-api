import { test } from '@japa/runner'
import ProductController from '#controllers/product/product_controller'

test.group('ProductController', () => {
  test('should have index method', ({ assert }) => {
    const controller = new ProductController()

    assert.property(controller, 'index')
    assert.typeOf(controller.index, 'function')
  })

  test('should have show method', ({ assert }) => {
    const controller = new ProductController()

    assert.property(controller, 'show')
    assert.typeOf(controller.show, 'function')
  })

  test('should have store method', ({ assert }) => {
    const controller = new ProductController()

    assert.property(controller, 'store')
    assert.typeOf(controller.store, 'function')
  })

  test('should have update method', ({ assert }) => {
    const controller = new ProductController()

    assert.property(controller, 'update')
    assert.typeOf(controller.update, 'function')
  })

  test('should have groupedByCategory method', ({ assert }) => {
    const controller = new ProductController()

    assert.property(controller, 'groupedByCategory')
    assert.typeOf(controller.groupedByCategory, 'function')
  })
})
