import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductModifierGroupCommand } from '#kernel/product/application/command/create_product_modifier_group_command'
import { UpdateProductModifierGroupCommand } from '#kernel/product/application/command/update_product_modifier_group_command'
import { DeleteProductModifierGroupCommand } from '#kernel/product/application/command/delete_product_modifier_group_command'
import { CreateProductModifierCommand } from '#kernel/product/application/command/create_product_modifier_command'
import { UpdateProductModifierCommand } from '#kernel/product/application/command/update_product_modifier_command'
import { DeleteProductModifierCommand } from '#kernel/product/application/command/delete_product_modifier_command'
import { AttachModifierGroupToProductCommand } from '#kernel/product/application/command/attach_modifier_group_to_product_command'
import { DetachModifierGroupFromProductCommand } from '#kernel/product/application/command/detach_modifier_group_from_product_command'
import { GetProductModifierGroupQuery } from '#kernel/product/application/query/get_product_modifier_group_query'
import { ListProductModifierGroupsQuery } from '#kernel/product/application/query/list_product_modifier_groups_query'
import { GetProductModifierQuery } from '#kernel/product/application/query/get_product_modifier_query'
import { ListProductModifiersByGroupQuery } from '#kernel/product/application/query/list_product_modifiers_by_group_query'
import { ListProductModifierGroupsByProductQuery } from '#kernel/product/application/query/list_product_modifier_groups_by_product_query'
import {
  createProductModifierGroupSchema,
  updateProductModifierGroupSchema,
  createProductModifierSchema,
  updateProductModifierSchema,
  attachModifierGroupToProductSchema,
  detachModifierGroupFromProductSchema,
} from '#validators/product_modifier_validator'
import { SelectionType } from '#kernel/product/domain/type/selection_type'
import { AdjustmentType } from '#kernel/product/domain/type/adjustment_type'

export default class ProductModifierController extends AppAbstractController {
  constructor() {
    super()
  }

  // ============================================
  // Modifier Group Endpoints
  // ============================================

  /**
   * List all modifier groups
   */
  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductModifierGroupsQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  /**
   * Get a single modifier group by ID
   */
  public async show({ request, response }: HttpContext) {
    const groupId = request.param('id')
    const group = await this.handleQuery(new GetProductModifierGroupQuery(groupId))

    return response.ok({ data: group })
  }

  /**
   * Create a new modifier group
   */
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductModifierGroupSchema)

    await this.handleCommand(
      new CreateProductModifierGroupCommand(
        payload.designation,
        payload.minSelections ?? 0,
        payload.maxSelections ?? null,
        (payload.selectionType as SelectionType) ?? SelectionType.MULTIPLE,
        payload.required ?? false,
        payload.available ?? true,
        payload.sortOrder ?? 0
      )
    )

    return response.created()
  }

  /**
   * Update a modifier group
   */
  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductModifierGroupSchema)
    const groupId = request.param('id')

    await this.handleCommand(
      new UpdateProductModifierGroupCommand(
        groupId,
        payload.designation,
        payload.minSelections ?? 0,
        payload.maxSelections ?? null,
        (payload.selectionType as SelectionType) ?? SelectionType.MULTIPLE,
        payload.required ?? false,
        payload.available ?? true,
        payload.sortOrder ?? 0
      )
    )

    return response.noContent()
  }

  /**
   * Delete a modifier group
   */
  public async destroy({ request, response }: HttpContext) {
    const groupId = request.param('id')

    await this.handleCommand(new DeleteProductModifierGroupCommand(groupId))

    return response.noContent()
  }

  // ============================================
  // Modifier Endpoints
  // ============================================

  /**
   * List all modifiers for a modifier group
   */
  public async listModifiers({ request, response }: HttpContext) {
    const groupId = request.param('id')
    const query = request.qs()

    const result = await this.handleQuery(
      new ListProductModifiersByGroupQuery(
        groupId,
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  /**
   * Get a single modifier by ID
   */
  public async showModifier({ request, response }: HttpContext) {
    const modifierId = request.param('modifierId')
    const modifier = await this.handleQuery(new GetProductModifierQuery(modifierId))

    return response.ok({ data: modifier })
  }

  /**
   * Create a new modifier within a group
   */
  public async storeModifier({ request, response }: HttpContext) {
    const groupId = request.param('id')
    const payload = await request.validateUsing(createProductModifierSchema)

    console.log({ payload }, { groupId })

    await this.handleCommand(
      new CreateProductModifierCommand(
        groupId,
        payload.designation,
        payload.priceAdjustment ?? 0,
        (payload.adjustmentType as AdjustmentType) ?? AdjustmentType.FIXED,
        payload.available ?? true,
        payload.sortOrder ?? 0
      )
    )

    return response.created()
  }

  /**
   * Update a modifier
   */
  public async updateModifier({ request, response }: HttpContext) {
    const modifierId = request.param('modifierId')
    const payload = await request.validateUsing(updateProductModifierSchema)

    await this.handleCommand(
      new UpdateProductModifierCommand(
        modifierId,
        payload.designation,
        payload.priceAdjustment ?? 0,
        (payload.adjustmentType as AdjustmentType) ?? AdjustmentType.FIXED,
        payload.available ?? true,
        payload.sortOrder ?? 0
      )
    )

    return response.noContent()
  }

  /**
   * Delete a modifier
   */
  public async destroyModifier({ request, response }: HttpContext) {
    const modifierId = request.param('modifierId')

    await this.handleCommand(new DeleteProductModifierCommand(modifierId))

    return response.noContent()
  }

  // ============================================
  // Product Integration Endpoints
  // ============================================

  /**
   * List modifier groups attached to a product
   */
  public async listByProduct({ request, response }: HttpContext) {
    const productId = request.param('productId')
    const query = request.qs()

    const result = await this.handleQuery(
      new ListProductModifierGroupsByProductQuery(
        productId,
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  /**
   * Attach a modifier group to a product
   */
  public async attachToProduct({ request, response }: HttpContext) {
    const productId = request.param('productId')
    const payload = await request.validateUsing(attachModifierGroupToProductSchema)

    await this.handleCommand(
      new AttachModifierGroupToProductCommand(
        productId,
        payload.modifierGroupId,
        payload.sortOrder ?? 0
      )
    )

    return response.noContent()
  }

  /**
   * Detach a modifier group from a product
   */
  public async detachFromProduct({ request, response }: HttpContext) {
    const productId = request.param('productId')
    const modifierGroupId = request.param('modifierGroupId')

    await this.handleCommand(new DetachModifierGroupFromProductCommand(productId, modifierGroupId))

    return response.noContent()
  }
}
