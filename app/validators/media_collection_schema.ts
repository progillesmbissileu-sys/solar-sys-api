import vine from '@vinejs/vine'

export const createMediaCollectionSchema = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string().trim().optional(),
  })
)

export const updateMediaCollectionSchema = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    description: vine.string().trim().nullable().optional(),
  })
)

export const addImagesToCollectionSchema = vine.compile(
  vine.object({
    images: vine
      .array(
        vine.object({
          imageId: vine.string().trim(),
          sortOrder: vine.number().optional(),
        })
      )
      .minLength(1),
  })
)

export const reorderCollectionImagesSchema = vine.compile(
  vine.object({
    imageOrders: vine.array(
      vine.object({
        imageId: vine.string().trim(),
        sortOrder: vine.number(),
      })
    ),
  })
)
