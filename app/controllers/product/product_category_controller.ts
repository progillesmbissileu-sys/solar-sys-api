import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import {
  createProductCategorySchema,
  updateProductCategorySchema,
} from '#validators/product_validator'
import { CreateProductCategoryCommand } from '#kernel/product/application/command/create_product_category_command'
import { UpdateProductCategoryCommand } from '#kernel/product/application/command/update_product_category_command'
import ActiveRecord from '#database/active-records/product_category'
import ProductActiveRecord from '#database/active-records/product'
import app from '@adonisjs/core/services/app'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'

export default class ProductCategoryController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await ActiveRecord.query()
      .whereILike('designation', `%${query.q || ''}%`)
      .orderBy('created_at', 'desc')
      .paginate(query.page || 1, query.limit || 10)

    return response.ok(result)
  }

  public async show({ response, request }: HttpContext) {
    const categoryId = await request.param('id')
    const result = await ActiveRecord.find(categoryId)

    return response.accepted({ data: result })
  }

  public async products({ response, request }: HttpContext) {
    const categoryId = await request.param('id')
    const query = request.qs()

    const orderBy = query.orderBy || 'created_at'
    const orderDirection = query.orderDirection || 'desc'

    const result = await ProductActiveRecord.query()
      .where('category_id', categoryId)
      .whereILike('designation', `%${query.q || ''}%`)
      .orderBy(orderBy, orderDirection)
      .paginate(query.page || 1, query.limit || 10)

    const mediaUploadService = (await app.container.make(
      'MediaUploadService'
    )) as MediaManagerInterface
    const paginatedResult = result.toJSON()

    paginatedResult.data = await Promise.all(
      paginatedResult.data.map(async (product: any) => {
        let signedUrl = null
        const relativeKey = product.picture?.relativeKey || product.picture?.relative_key
        if (relativeKey) {
          signedUrl = await mediaUploadService.getSignedUrl(relativeKey)
        }
        if (product.picture) {
          delete product.picture.url
        }

        return {
          id: product.id,
          slug: product.slug,
          designation: product.designation,
          price: product.price,
          categoryName: product.category?.designation,
          categoryId: product.category?.id,
          pictureUrl: signedUrl,
          brand: product.brand,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      })
    )

    return response.ok(paginatedResult)
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductCategorySchema)

    await this.handleCommand(
      new CreateProductCategoryCommand(payload.designation, payload.type, payload.parentId)
    )
    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductCategorySchema)
    const categoryId = await request.param('id')

    await this.handleCommand(
      new UpdateProductCategoryCommand(
        categoryId,
        payload.designation,
        payload.type,
        payload.parentId
      )
    )
    return response.noContent()
  }
}
