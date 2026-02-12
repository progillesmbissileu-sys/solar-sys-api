import type { HttpContext } from '@adonisjs/core/http'
import ActiveRecord from '#database/active-records/market_service'
import { createMarketServiceSchema, updateMarketServiceSchema } from '#validators/market_validtor'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateMarketServiceCommand } from '#kernel/market/application/command/create_market_service_command'
import { AppId } from '#shared/domain/app_id'
import { UpdateMarketServiceCommand } from '#kernel/market/application/command/update_market_service.command'
import { DeleteMarketServiceCommand } from '#kernel/market/application/command/delete_market_service.command'

export default class MarketServicesController extends AppAbstractController {
  constructor() {
    super()
  }
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const collection = await ActiveRecord.all()

    return response.accepted({ data: collection })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const service = await request.validateUsing(createMarketServiceSchema)

    await this.handleCommand(
      new CreateMarketServiceCommand(
        service.designation,
        service.thumbnailUrl,
        AppId.fromString(service.thumbnailId),
        service.shortDescription,
        service.features
      )
    )

    return response.created()
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const service = await ActiveRecord.findOrFail(params.id)

    return response.accepted({ data: service })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const service = await request.validateUsing(updateMarketServiceSchema)

    await this.handleCommand(
      new UpdateMarketServiceCommand(
        AppId.fromString(params.id),
        service.designation,
        service.thumbnailUrl,
        AppId.fromString(service.thumbnailId),
        service.shortDescription,
        service.features
      )
    )

    return response.noContent()
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.handleCommand(new DeleteMarketServiceCommand(AppId.fromString(params.id)))

    return response.noContent()
  }
}
