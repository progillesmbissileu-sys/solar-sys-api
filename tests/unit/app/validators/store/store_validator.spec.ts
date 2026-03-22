import { test } from '@japa/runner'
import { createStoreSchema, updateStoreSchema } from '#validators/store_validator'

test.group('createStoreSchema', () => {
  const validPayload = {
    designation: 'Main Branch',
    address: {
      street: '123 Solar Street',
      city: 'Douala',
      country: 'Cameroon',
      postalCode: '00000',
    },
    phoneNumber1: {
      countryCode: '237',
      number: '699112233',
    },
    businessHours: [
      { day: 0, startTime: 8, endTime: 17 },
      { day: 1, startTime: 8, endTime: 17 },
    ],
    phoneNumber2: {
      countryCode: '237',
      number: '677445566',
    },
    whatsappNumber: {
      countryCode: '237',
      number: '655001122',
    },
  }

  test('should validate a complete valid payload', async ({ assert }) => {
    const result = await createStoreSchema.validate(validPayload)

    assert.equal(result.designation, 'Main Branch')
    assert.equal(result.address.street, '123 Solar Street')
    assert.equal(result.address.city, 'Douala')
    assert.equal(result.address.country, 'Cameroon')
    assert.equal(result.address.postalCode, '00000')
    assert.equal(result.phoneNumber1.countryCode, '237')
    assert.equal(result.phoneNumber1.number, '699112233')
    assert.lengthOf(result.businessHours, 2)
    assert.equal(result.businessHours[0].day, 0)
    assert.equal(result.businessHours[0].startTime, 8)
    assert.equal(result.businessHours[0].endTime, 17)
    assert.equal(result.phoneNumber2!.countryCode, '237')
    assert.equal(result.whatsappNumber!.number, '655001122')
  })

  test('should validate when optional fields are omitted', async ({ assert }) => {
    const payload = {
      designation: 'Secondary Branch',
      address: {
        street: '45 Market Road',
        city: 'Yaounde',
      },
      phoneNumber1: {
        countryCode: '237',
        number: '611223344',
      },
      businessHours: [{ day: 2, startTime: 9, endTime: 18 }],
    }

    const result = await createStoreSchema.validate(payload)

    assert.equal(result.designation, 'Secondary Branch')
    assert.equal(result.address.city, 'Yaounde')
    assert.isUndefined(result.address.country)
    assert.isUndefined(result.address.postalCode)
    assert.isUndefined(result.phoneNumber2)
    assert.isUndefined(result.whatsappNumber)
    assert.lengthOf(result.businessHours, 1)
  })

  test('should reject empty designation', async ({ assert }) => {
    const payload = {
      ...validPayload,
      designation: '',
    }

    try {
      await createStoreSchema.validate(payload)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject missing address', async ({ assert }) => {
    const payload = {
      designation: 'Store Without Address',
      phoneNumber1: {
        countryCode: '237',
        number: '699112233',
      },
      businessHours: [{ day: 0, startTime: 8, endTime: 17 }],
    }

    try {
      await createStoreSchema.validate(payload as any)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject missing phoneNumber1', async ({ assert }) => {
    const payload = {
      designation: 'Store Without Primary Phone',
      address: {
        street: '123 Solar Street',
        city: 'Douala',
      },
      businessHours: [{ day: 0, startTime: 8, endTime: 17 }],
    }

    try {
      await createStoreSchema.validate(payload as any)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject missing businessHours', async ({ assert }) => {
    const payload = {
      designation: 'Store Without Hours',
      address: {
        street: '123 Solar Street',
        city: 'Douala',
      },
      phoneNumber1: {
        countryCode: '237',
        number: '699112233',
      },
    }

    try {
      await createStoreSchema.validate(payload as any)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject invalid businessHours item shape', async ({ assert }) => {
    const payload = {
      ...validPayload,
      businessHours: [{ day: 0, startTime: 8 }],
    }

    try {
      await createStoreSchema.validate(payload as any)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  test('should reject invalid phone object shape', async ({ assert }) => {
    const payload = {
      ...validPayload,
      phoneNumber1: {
        countryCode: '237',
      },
    }

    try {
      await createStoreSchema.validate(payload as any)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})

test.group('updateStoreSchema', () => {
  test('should validate the same payload contract as create schema', async ({ assert }) => {
    const payload = {
      designation: 'Updated Branch',
      address: {
        street: '789 New Avenue',
        city: 'Buea',
        country: 'Cameroon',
      },
      phoneNumber1: {
        countryCode: '237',
        number: '644556677',
      },
      businessHours: [{ day: 3, startTime: 7, endTime: 16 }],
      whatsappNumber: {
        countryCode: '237',
        number: '688990011',
      },
    }

    const result = await updateStoreSchema.validate(payload)

    assert.equal(result.designation, 'Updated Branch')
    assert.equal(result.address.street, '789 New Avenue')
    assert.equal(result.phoneNumber1.number, '644556677')
    assert.lengthOf(result.businessHours, 1)
    assert.equal(result.businessHours[0].day, 3)
    assert.equal(result.whatsappNumber!.countryCode, '237')
  })

  test('should reject payload missing required fields', async ({ assert }) => {
    const payload = {
      designation: 'Only Name',
    }

    try {
      await updateStoreSchema.validate(payload as any)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})
