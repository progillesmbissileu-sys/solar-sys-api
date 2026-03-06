import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { createProductSchema, updateProductSchema } from '#validators/product_validator'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import { ListProductsQuery } from '#kernel/product/application/queries/list_products_query'
import { GetProductQuery } from '#kernel/product/application/queries/get_product_query'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/queries/list_products_grouped_by_category_query'

export default class ProductController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductsQuery(
        Number(query.page) || 1,
        Number(query.limit) || 10,
        String(query.q || ''),
        'created_at',
        query.sort === 'asc' ? 'asc' : 'desc'
      )
    )

    return response.ok(result)
  }

  public async show({ request, response }: HttpContext) {
    const productId = await request.param('id')
    const product = await this.handleQuery(new GetProductQuery(productId))

    return response.ok({ data: product })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)

    await this.handleCommand(
      new CreateProductCommand(
        payload.designation,
        payload.mainImageId,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand,
        payload.imageIds || []
      )
    )
    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductSchema)

    const productId = await request.param('id')

    await this.handleCommand(
      new UpdateProductCommand(
        productId,
        payload.designation,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand
      )
    )
    return response.noContent()
  }

  public async groupedByCategory({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductsGroupedByCategoryQuery(
        Number(query.page) || 1,
        Number(query.limit) || 10,
        String(query.q || '')
      )
    )

    return response.ok(result)
  }
}
