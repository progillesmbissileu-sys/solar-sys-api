import vine from '@vinejs/vine'

export const createCustomerSchema = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(2).maxLength(100),
    last_name: vine.string().trim().minLength(2).maxLength(100),
    phone: vine.string().trim().minLength(10).maxLength(20),
    email: vine.string().trim().email().maxLength(255).nullable().optional(),
  })
)

export const updateCustomerSchema = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(2).maxLength(100).optional(),
    last_name: vine.string().trim().minLength(2).maxLength(100).optional(),
    phone: vine.string().trim().minLength(10).maxLength(20).optional(),
    email: vine.string().trim().email().maxLength(255).nullable().optional(),
  })
)

export const createAddressSchema = vine.compile(
  vine.object({
    address_line1: vine.string().trim().maxLength(255),
    address_line2: vine.string().trim().maxLength(255).nullable().optional(),
    city: vine.string().trim().maxLength(100),
    state: vine.string().trim().maxLength(100),
    postal_code: vine.string().trim().maxLength(20),
    country: vine.string().trim().maxLength(100),
    type: vine.enum(['SHIPPING', 'BILLING']),
    is_default: vine.boolean().optional(),
  })
)

export const updateAddressSchema = vine.compile(
  vine.object({
    address_line1: vine.string().trim().maxLength(255).optional(),
    address_line2: vine.string().trim().maxLength(255).nullable().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postal_code: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    type: vine.enum(['SHIPPING', 'BILLING']).optional(),
    is_default: vine.boolean().optional(),
  })
)
