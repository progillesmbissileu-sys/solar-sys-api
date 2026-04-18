import type { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import {
  StoreImageCommand,
  StoreImageCommandReturnType,
} from '#kernel/medias/application/command/store_image_command'
import { AppFile } from '#shared/domain/app_file'
import { mediaSchema, updateImageMediaSchema } from '#validators/media_schema'
import { DeleteImageCommand } from '#kernel/medias/application/command/delete_image_command'
import { AppId } from '#shared/domain/app_id'
import { UpdateImageMediaCommand } from '#kernel/medias/application/command/update_image_media_command'
import { ListImageMediasQuery } from '#kernel/medias/application/query/list_image_medias_query'
import { GetImageMediaQuery } from '#kernel/medias/application/query/get_image_media_query'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import {
  ImageMediaListItemDto,
  ImageMediaDetailsDto,
} from '#kernel/medias/application/dto/image_media_read_dto'

export default class ImageMediasController extends AppAbstractController {
  constructor() {
    super()
  }

  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery<PaginatedResultDto<ImageMediaListItemDto>>(
      new ListImageMediasQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const file = request.file('image', {})

    const payload = await request.validateUsing(mediaSchema)

    const result = await this.handleCommand<StoreImageCommandReturnType>(
      new StoreImageCommand(new AppFile(file), payload.title, payload.alt)
    )

    return response.created(result)
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    const imageMediaId = request.param('id')
    const image = await this.handleQuery<ImageMediaDetailsDto>(new GetImageMediaQuery(imageMediaId))

    return response.ok({ data: image })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const imageMediaId = request.param('id')
    const payload = await request.validateUsing(updateImageMediaSchema)

    await this.handleCommand(new UpdateImageMediaCommand(imageMediaId, payload.title, payload.alt))

    return response.noContent()
  }

  /**
   * Delete record
   */
  async destroy({ request, response }: HttpContext) {
    const params = request.params()

    await this.handleCommand<void>(new DeleteImageCommand(AppId.fromString(params.id)))

    return response.noContent()
  }
}
