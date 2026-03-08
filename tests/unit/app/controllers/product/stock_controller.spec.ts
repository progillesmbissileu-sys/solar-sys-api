import { test } from '@japa/runner'
import StockController from '#controllers/product/stock_controller'

test.group('StockController', () => {
  test('should have show method', ({ assert }) => {
    const controller = new StockController()

    assert.property(controller, 'show')
    assert.typeOf(controller.show, 'function')
  })

  test('should have add method', ({ assert }) => {
    const controller = new StockController()

    assert.property(controller, 'add')
    assert.typeOf(controller.add, 'function')
  })

  test('should have remove method', ({ assert }) => {
    const controller = new StockController()

    assert.property(controller, 'remove')
    assert.typeOf(controller.remove, 'function')
  })

  test('should have set method', ({ assert }) => {
    const controller = new StockController()

    assert.property(controller, 'set')
    assert.typeOf(controller.set, 'function')
  })

  test('should have history method', ({ assert }) => {
    const controller = new StockController()

    assert.property(controller, 'history')
    assert.typeOf(controller.history, 'function')
  })

  test('should have lowStock method', ({ assert }) => {
    const controller = new StockController()

    assert.property(controller, 'lowStock')
    assert.typeOf(controller.lowStock, 'function')
  })
})
