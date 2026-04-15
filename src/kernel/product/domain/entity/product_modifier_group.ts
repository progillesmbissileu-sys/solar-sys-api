import { AppId } from '#shared/domain/app_id'
import { SelectionType } from '#kernel/product/domain/type/selection_type'
import { ProductModifier } from '#kernel/product/domain/entity/product_modifier'

export class ProductModifierGroup {
  constructor(
    private id: AppId | null,
    private designation: string,
    private minSelections: number = 0,
    private maxSelections: number | null = null,
    private selectionType: SelectionType = SelectionType.MULTIPLE,
    private required: boolean = false,
    private available: boolean = true,
    private sortIndex: number = 0,
    private modifiers: ProductModifier[] = [],
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): AppId | null {
    return this.id
  }

  setId(id: AppId): void {
    this.id = id
  }

  getDesignation(): string {
    return this.designation
  }

  getMinSelections(): number {
    return this.minSelections
  }

  getMaxSelections(): number | null {
    return this.maxSelections
  }

  getSelectionType(): SelectionType {
    return this.selectionType
  }

  isRequired(): boolean {
    return this.required
  }

  isAvailable(): boolean {
    return this.available
  }

  getSortIndex(): number {
    return this.sortIndex
  }

  getModifiers(): ProductModifier[] {
    return this.modifiers
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  setDesignation(designation: string): void {
    this.designation = designation
  }

  setMinSelections(minSelections: number): void {
    this.minSelections = minSelections
  }

  setMaxSelections(maxSelections: number | null): void {
    this.maxSelections = maxSelections
  }

  setSelectionType(selectionType: SelectionType): void {
    this.selectionType = selectionType
  }

  setRequired(required: boolean): void {
    this.required = required
  }

  setAvailable(available: boolean): void {
    this.available = available
  }

  setSortIndex(sortIndex: number): void {
    this.sortIndex = sortIndex
  }

  setModifiers(modifiers: ProductModifier[]): void {
    this.modifiers = modifiers
  }

  /**
   * Check if the group allows unlimited selections
   */
  hasUnlimitedSelections(): boolean {
    return this.maxSelections === null
  }

  /**
   * Check if the group is single selection only
   */
  isSingleSelection(): boolean {
    return this.selectionType === SelectionType.SINGLE
  }

  /**
   * Validate selection count against group constraints
   */
  validateSelectionCount(count: number): boolean {
    if (count < this.minSelections) {
      return false
    }
    if (this.maxSelections !== null && count > this.maxSelections) {
      return false
    }
    return true
  }
}
