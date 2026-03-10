import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductPackCommand } from '#kernel/product/application/command/create_product_pack_command'
import { UpdateProductPackCommand } from '#kernel/product/application/command/update_product_pack_command'
import { DeleteProductPackCommand } from '#kernel/product/application/command/delete_product_pack_command'
import { SetProductPackStockCommand } from '#kernel/product/application/command/set_product_pack_stock_command'
import { GetProductPackQuery } from '#kernel/product/application/query/get_product_pack_query'
import { ListProductPacksQuery } from '#kernel/product/application/query/list_product_packs_query'
import { GetProductPackStockQuery } from '#kernel/product/application/query/get_product_pack_stock_query'
import {
  createProductPackSchema,
  updateProductPackSchema,
  setProductPackStockSchema,
} from '#validators/product_pack_validator'

export default class ProductPackController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ request, response }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductPacksQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  public async show({ request, response }: HttpContext) {
    const packId = await request.param('id')
    const pack = await this.handleQuery(new GetProductPackQuery(packId))

    return response.ok({ data: pack })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductPackSchema)

    await this.handleCommand(
      new CreateProductPackCommand(
        payload.designation,
        payload.price,
        payload.items,
        payload.description,
        payload.mainImageId,
        payload.stockQuantity,
        payload.lowStockThreshold
      )
    )

    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductPackSchema)
    const packId = await request.param('id')

    await this.handleCommand(
      new UpdateProductPackCommand(
        packId,
        payload.designation,
        payload.price,
        payload.items,
        payload.description,
        payload.mainImageId,
        payload.lowStockThreshold
      )
    )

    return response.noContent()
  }

  public async destroy({ request, response }: HttpContext) {
    const packId = await request.param('id')
    await this.handleCommand(new DeleteProductPackCommand(packId))

    return response.noContent()
  }

  public async stock({ request, response }: HttpContext) {
    const packId = await request.param('id')
    const stock = await this.handleQuery(new GetProductPackStockQuery(packId))

    return response.ok({ data: stock })
  }

  public async setStock({ request, response }: HttpContext) {
    const packId = await request.param('id')
    const payload = await request.validateUsing(setProductPackStockSchema)

    await this.handleCommand(new SetProductPackStockCommand(packId, payload.quantity))

    return response.noContent()
  }
}
