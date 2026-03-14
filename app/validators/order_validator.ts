import vine from '@vinejs/vine'

export const createOrderSchema = vine.compile(
  vine.object({
    customerId: vine.string().uuid(),
    items: vine
      .array(
        vine.object({
          productId: vine.string().uuid(),
          quantity: vine.number().min(1).max(1000),
        })
      )
      .minLength(1),
    shippingAddressId: vine.string().uuid(),
    customerNotes: vine.string().trim().maxLength(1000).nullable().optional(),
  })
)

export const updateOrderStatusSchema = vine.compile(
  vine.object({
    status: vine.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    adminNotes: vine.string().trim().maxLength(1000).nullable().optional(),
  })
)

export const cancelOrderSchema = vine.compile(
  vine.object({
    reason: vine.string().trim().maxLength(500).nullable().optional(),
  })
)
