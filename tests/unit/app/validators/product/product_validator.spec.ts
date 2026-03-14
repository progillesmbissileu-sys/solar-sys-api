import { test } from '@japa/runner'
import {
  createProductSchema,
  updateProductSchema,
  createProductCategorySchema,
  updateProductCategorySchema,
  addProductImageSchema,
  removeProductImageSchema,
} from '#validators/product_validator'

test.group('createProductSchema', () => {
  test('should validate valid product data', async ({ assert }) => {
    const data = {
      designation: 'Test Product',
      description: 'A test product description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      mainImageId: '550e8400-e29b-41d4-a716-446655440001',
      price: 99.99,
    }

    const result = await createProductSchema.validate(data)

    assert.equal(result.designation, 'Test Product')
    assert.equal(result.price, 99.99)
  })

  test('should accept optional brand', async ({ assert }) => {
    const data = {
      designation: 'Test Product',
      description: 'Description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      mainImageId: '550e8400-e29b-41d4-a716-446655440001',
      price: 50,
      brand: 'Test Brand',
    }

    const result = await createProductSchema.validate(data)

    assert.equal(result.brand, 'Test Brand')
  })

  test('should accept optional imageIds array', async ({ assert }) => {
    const data = {
      designation: 'Test Product',
      description: 'Description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      mainImageId: '550e8400-e29b-41d4-a716-446655440001',
      price: 50,
      imageIds: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'],
    }

    const result = await createProductSchema.validate(data)

    assert.isArray(result.imageIds)
    assert.lengthOf(result.imageIds!, 2)
  })

  test('should reject designation shorter than 2 characters', async ({ assert }) => {
    const data = {
      designation: 'A',
      description: 'Description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      mainImageId: '550e8400-e29b-41d4-a716-446655440001',
      price: 50,
    }

    try {
      await createProductSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject invalid categoryId UUID', async ({ assert }) => {
    const data = {
      designation: 'Test Product',
      description: 'Description',
      categoryId: 'invalid-uuid',
      mainImageId: '550e8400-e29b-41d4-a716-446655440001',
      price: 50,
    }

    try {
      await createProductSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject imageIds array longer than 2', async ({ assert }) => {
    const data = {
      designation: 'Test Product',
      description: 'Description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      mainImageId: '550e8400-e29b-41d4-a716-446655440001',
      price: 50,
      imageIds: [
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
      ],
    }

    try {
      await createProductSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('updateProductSchema', () => {
  test('should validate valid update data', async ({ assert }) => {
    const data = {
      designation: 'Updated Product',
      description: 'Updated description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      price: 149.99,
    }

    const result = await updateProductSchema.validate(data)

    assert.equal(result.designation, 'Updated Product')
    assert.equal(result.price, 149.99)
  })

  test('should accept optional brand', async ({ assert }) => {
    const data = {
      designation: 'Updated Product',
      description: 'Description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      price: 50,
      brand: 'New Brand',
    }

    const result = await updateProductSchema.validate(data)

    assert.equal(result.brand, 'New Brand')
  })

  test('should reject missing price', async ({ assert }) => {
    const data = {
      designation: 'Updated Product',
      description: 'Description',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
    }

    try {
      await updateProductSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('createProductCategorySchema', () => {
  test('should validate valid category data', async ({ assert }) => {
    const data = {
      designation: 'Electronics',
    }

    const result = await createProductCategorySchema.validate(data)

    assert.equal(result.designation, 'Electronics')
  })

  test('should accept optional type', async ({ assert }) => {
    const data = {
      designation: 'Electronics',
      type: 'CATEGORY',
    }

    const result = await createProductCategorySchema.validate(data)

    assert.equal(result.type, 'CATEGORY')
  })

  test('should accept TAG as type', async ({ assert }) => {
    const data = {
      designation: 'Featured',
      type: 'TAG',
    }

    const result = await createProductCategorySchema.validate(data)

    assert.equal(result.type, 'TAG')
  })

  test('should accept optional parentId', async ({ assert }) => {
    const data = {
      designation: 'Sub Category',
      parentId: '550e8400-e29b-41d4-a716-446655440000',
    }

    const result = await createProductCategorySchema.validate(data)

    assert.equal(result.parentId, '550e8400-e29b-41d4-a716-446655440000')
  })

  test('should reject invalid type', async ({ assert }) => {
    const data = {
      designation: 'Test',
      type: 'INVALID',
    }

    try {
      await createProductCategorySchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('updateProductCategorySchema', () => {
  test('should validate valid update data', async ({ assert }) => {
    const data = {
      designation: 'Updated Category',
      type: 'CATEGORY',
    }

    const result = await updateProductCategorySchema.validate(data)

    assert.equal(result.designation, 'Updated Category')
    assert.equal(result.type, 'CATEGORY')
  })

  test('should require type field', async ({ assert }) => {
    const data = {
      designation: 'Updated Category',
    }

    try {
      await updateProductCategorySchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('addProductImageSchema', () => {
  test('should validate valid image data', async ({ assert }) => {
    const data = {
      imageId: '550e8400-e29b-41d4-a716-446655440000',
      isMainImage: true,
    }

    const result = await addProductImageSchema.validate(data)

    assert.equal(result.imageId, '550e8400-e29b-41d4-a716-446655440000')
    assert.isTrue(result.isMainImage)
  })

  test('should reject invalid imageId UUID', async ({ assert }) => {
    const data = {
      imageId: 'invalid-uuid',
      isMainImage: false,
    }

    try {
      await addProductImageSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('removeProductImageSchema', () => {
  test('should validate valid image removal data', async ({ assert }) => {
    const data = {
      imageId: '550e8400-e29b-41d4-a716-446655440000',
    }

    const result = await removeProductImageSchema.validate(data)

    assert.equal(result.imageId, '550e8400-e29b-41d4-a716-446655440000')
  })

  test('should reject missing imageId', async ({ assert }) => {
    const data = {}

    try {
      await removeProductImageSchema.validate(data)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})
