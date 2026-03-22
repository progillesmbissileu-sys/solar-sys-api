import { test } from '@japa/runner'
import StoreController from '#controllers/store/store_controller'

test.group('StoreController', () => {
  test('should have index method', ({ assert }) => {
    const controller = new StoreController()

    assert.property(controller, 'index')
    assert.typeOf(controller.index, 'function')
  })

  test('should have show method', ({ assert }) => {
    const controller = new StoreController()

    assert.property(controller, 'show')
    assert.typeOf(controller.show, 'function')
  })

  test('should have store method', ({ assert }) => {
    const controller = new StoreController()

    assert.property(controller, 'store')
    assert.typeOf(controller.store, 'function')
  })

  test('should have update method', ({ assert }) => {
    const controller = new StoreController()

    assert.property(controller, 'update')
    assert.typeOf(controller.update, 'function')
  })
})
