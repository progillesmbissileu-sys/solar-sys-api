import type { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import {
  MediaCollectionListItemDto,
  MediaCollectionDetailsDto,
} from '#kernel/medias/application/dto/media_collection_read_dto'
import {
  createMediaCollectionSchema,
  updateMediaCollectionSchema,
  addImagesToCollectionSchema,
  reorderCollectionImagesSchema,
} from '#validators/media_collection_schema'
import { CreateMediaCollectionCommand } from '#kernel/medias/application/command/create_media_collection_command'
import { UpdateMediaCollectionCommand } from '#kernel/medias/application/command/update_media_collection_command'
import { DeleteMediaCollectionCommand } from '#kernel/medias/application/command/delete_media_collection_command'
import { AddImagesToCollectionCommand } from '#kernel/medias/application/command/add_images_to_collection_command'
import { RemoveImageFromCollectionCommand } from '#kernel/medias/application/command/remove_image_from_collection_command'
import { ReorderCollectionImagesCommand } from '#kernel/medias/application/command/reorder_collection_images_command'
import { ListMediaCollectionsQuery } from '#kernel/medias/application/query/list_media_collections_query'
import { GetMediaCollectionQuery } from '#kernel/medias/application/query/get_media_collection_query'
import { AppId } from '#shared/domain/app_id'

export default class MediaCollectionsController extends AppAbstractController {
  async index({ request, response }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery<PaginatedResultDto<MediaCollectionListItemDto>>(
      new ListMediaCollectionsQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createMediaCollectionSchema)

    const id = await this.handleCommand<string>(
      new CreateMediaCollectionCommand(payload.name, payload.description)
    )

    return response.created({ id })
  }

  async show({ request, response }: HttpContext) {
    const collectionId = request.param('id')
    const collection = await this.handleQuery<MediaCollectionDetailsDto>(
      new GetMediaCollectionQuery(collectionId)
    )

    return response.ok({ data: collection })
  }

  async update({ request, response }: HttpContext) {
    const collectionId = request.param('id')
    const payload = await request.validateUsing(updateMediaCollectionSchema)

    await this.handleCommand(
      new UpdateMediaCollectionCommand(collectionId, payload.name, payload.description)
    )

    return response.noContent()
  }

  async destroy({ request, response }: HttpContext) {
    const params = request.params()

    await this.handleCommand(new DeleteMediaCollectionCommand(AppId.fromString(params.id)))

    return response.noContent()
  }

  async addImages({ request, response }: HttpContext) {
    const collectionId = request.param('id')
    const payload = await request.validateUsing(addImagesToCollectionSchema)

    await this.handleCommand(new AddImagesToCollectionCommand(collectionId, payload.images))

    return response.noContent()
  }

  async removeImage({ request, response }: HttpContext) {
    const collectionId = request.param('id')
    const imageId = request.param('imageId')

    await this.handleCommand(new RemoveImageFromCollectionCommand(collectionId, imageId))

    return response.noContent()
  }

  async reorderImages({ request, response }: HttpContext) {
    const collectionId = request.param('id')
    const payload = await request.validateUsing(reorderCollectionImagesSchema)

    await this.handleCommand(new ReorderCollectionImagesCommand(collectionId, payload.imageOrders))

    return response.noContent()
  }
}
