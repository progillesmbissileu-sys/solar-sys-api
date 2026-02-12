import vine from '@vinejs/vine'

export const createMarketServiceSchema = vine.compile(
  vine.object({
    designation: vine.string(),
    thumbnailId: vine.string().uuid(),
    thumbnailUrl: vine.string(),
    shortDescription: vine.string(),
    features: vine.array(vine.any()).optional(),
  })
)

export const updateMarketServiceSchema = createMarketServiceSchema
