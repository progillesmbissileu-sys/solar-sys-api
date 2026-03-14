import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { addProductImageSchema, removeProductImageSchema } from '#validators/product_validator'
import { AddProductImageCommand } from '#kernel/product/application/command/add_product_image_command'
import { RemoveProductImageCommand } from '#kernel/product/application/command/remove_product_image_command'

export default class ProductImageController extends AppAbstractController {
  constructor() {
    super()
  }

  public async addImage({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addProductImageSchema)
    const productId = await request.param('id')

    await this.handleCommand(
      new AddProductImageCommand(productId, payload.imageId, payload.isMainImage)
    )
    return response.noContent()
  }

  public async removeImage({ request, response }: HttpContext) {
    const payload = await request.validateUsing(removeProductImageSchema)
    const productId = await request.param('id')

    await this.handleCommand(new RemoveProductImageCommand(productId, payload.imageId))
    return response.noContent()
  }
}
