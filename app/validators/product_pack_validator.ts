import vine from '@vinejs/vine'

export const createProductPackSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    description: vine.string().optional(),
    price: vine.number().positive(),
    mainImageId: vine.string().uuid().optional(),
    stockQuantity: vine.number().positive().nullable().optional(),
    lowStockThreshold: vine.number().positive().optional(),
    items: vine
      .array(
        vine.object({
          productId: vine.string().uuid(),
          quantity: vine.number().positive().min(1),
        })
      )
      .minLength(1),
  })
)

export const updateProductPackSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    description: vine.string().optional(),
    price: vine.number().positive(),
    mainImageId: vine.string().uuid().optional(),
    lowStockThreshold: vine.number().positive().optional(),
    items: vine
      .array(
        vine.object({
          productId: vine.string().uuid(),
          quantity: vine.number().positive().min(1),
        })
      )
      .minLength(1),
  })
)

export const setProductPackStockSchema = vine.compile(
  vine.object({
    quantity: vine.number().positive().nullable(),
  })
)
