import vine from '@vinejs/vine'

export const createProductModifierGroupSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2).maxLength(255),
    minSelections: vine.number().min(0).optional(),
    maxSelections: vine.number().min(1).nullable().optional(),
    selectionType: vine.enum(['single', 'multiple']).optional(),
    required: vine.boolean().optional(),
    available: vine.boolean().optional(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const updateProductModifierGroupSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2).maxLength(255),
    minSelections: vine.number().min(0).optional(),
    maxSelections: vine.number().min(1).nullable().optional(),
    selectionType: vine.enum(['single', 'multiple']).optional(),
    required: vine.boolean().optional(),
    available: vine.boolean().optional(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const createProductModifierSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2).maxLength(255),
    priceAdjustment: vine.number().optional(),
    adjustmentType: vine.enum(['fixed', 'percentage']).optional(),
    available: vine.boolean().optional(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const updateProductModifierSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2).maxLength(255),
    priceAdjustment: vine.number().optional(),
    adjustmentType: vine.enum(['fixed', 'percentage']).optional(),
    available: vine.boolean().optional(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const attachModifierGroupToProductSchema = vine.compile(
  vine.object({
    modifierGroupId: vine.string().uuid(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const detachModifierGroupFromProductSchema = vine.compile(
  vine.object({
    modifierGroupId: vine.string().uuid(),
  })
)
