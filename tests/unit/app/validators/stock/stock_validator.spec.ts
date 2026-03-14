import { test } from '@japa/runner'
import {
  addStockSchema,
  removeStockSchema,
  setStockSchema,
  stockHistorySchema,
} from '#validators/stock_validator'

test.group('addStockSchema', () => {
  test('should validate valid add stock data', async ({ assert }) => {
    const data = {
      quantity: 10,
    }

    const result = await addStockSchema.validate(data)

    assert.equal(result.quantity, 10)
  })

  test('should accept optional reason', async ({ assert }) => {
    const data = {
      quantity: 5,
      reason: 'Restocking from supplier',
    }

    const result = await addStockSchema.validate(data)

    assert.equal(result.reason, 'Restocking from supplier')
  })

  test('should reject zero quantity', async ({ assert }) => {
    const data = {
      quantity: 0,
    }

    try {
      await addStockSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject negative quantity', async ({ assert }) => {
    const data = {
      quantity: -5,
    }

    try {
      await addStockSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject reason longer than 255 characters', async ({ assert }) => {
    const data = {
      quantity: 10,
      reason: 'a'.repeat(256),
    }

    try {
      await addStockSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('removeStockSchema', () => {
  test('should validate valid remove stock data', async ({ assert }) => {
    const data = {
      quantity: 5,
    }

    const result = await removeStockSchema.validate(data)

    assert.equal(result.quantity, 5)
  })

  test('should accept optional reason', async ({ assert }) => {
    const data = {
      quantity: 3,
      reason: 'Damaged goods',
    }

    const result = await removeStockSchema.validate(data)

    assert.equal(result.reason, 'Damaged goods')
  })

  test('should reject zero quantity', async ({ assert }) => {
    const data = {
      quantity: 0,
    }

    try {
      await removeStockSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject negative quantity', async ({ assert }) => {
    const data = {
      quantity: -1,
    }

    try {
      await removeStockSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('setStockSchema', () => {
  test('should validate valid set stock data', async ({ assert }) => {
    const data = {
      quantity: 100,
    }

    const result = await setStockSchema.validate(data)

    assert.equal(result.quantity, 100)
  })

  test('should accept zero quantity', async ({ assert }) => {
    const data = {
      quantity: 0,
    }

    const result = await setStockSchema.validate(data)

    assert.equal(result.quantity, 0)
  })

  test('should accept optional reason', async ({ assert }) => {
    const data = {
      quantity: 50,
      reason: 'Inventory adjustment',
    }

    const result = await setStockSchema.validate(data)

    assert.equal(result.reason, 'Inventory adjustment')
  })

  test('should reject negative quantity', async ({ assert }) => {
    const data = {
      quantity: -1,
    }

    try {
      await setStockSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('stockHistorySchema', () => {
  test('should validate valid pagination data', async ({ assert }) => {
    const data = {
      page: 1,
      limit: 20,
    }

    const result = await stockHistorySchema.validate(data)

    assert.equal(result.page, 1)
    assert.equal(result.limit, 20)
  })

  test('should accept empty data with defaults', async ({ assert }) => {
    const data = {}

    const result = await stockHistorySchema.validate(data)

    assert.isUndefined(result.page)
    assert.isUndefined(result.limit)
  })

  test('should reject page less than 1', async ({ assert }) => {
    const data = {
      page: 0,
    }

    try {
      await stockHistorySchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject limit greater than 100', async ({ assert }) => {
    const data = {
      limit: 101,
    }

    try {
      await stockHistorySchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject limit less than 1', async ({ assert }) => {
    const data = {
      limit: 0,
    }

    try {
      await stockHistorySchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})
