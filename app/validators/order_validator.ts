import vine from '@vinejs/vine'

export const createOrderSchema = vine.compile(
  vine.object({
    customer_id: vine.string().uuid(),
    items: vine
      .array(
        vine.object({
          product_id: vine.string().uuid(),
          quantity: vine.number().min(1).max(1000),
        })
      )
      .minLength(1),
    shipping_address_id: vine.string().uuid(),
    customer_notes: vine.string().trim().maxLength(1000).nullable().optional(),
  })
)

export const updateOrderStatusSchema = vine.compile(
  vine.object({
    status: vine.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    admin_notes: vine.string().trim().maxLength(1000).nullable().optional(),
  })
)

export const cancelOrderSchema = vine.compile(
  vine.object({
    reason: vine.string().trim().maxLength(500).nullable().optional(),
  })
)
