import string from '@adonisjs/core/helpers/string'

export class ProductCategory {
  constructor(
    private id: any,
    private designation: string,
    private type: 'CATEGORY' | 'TAG' = 'CATEGORY',
    private parentId: any | null = null,
    private slug?: string,
    private createdAt: Date | null = null,
    private updatedAt: Date | null = null
  ) {
    if (!slug) {
      this.slug = string.slug(this.designation + '-' + string.generateRandom(8))
    }
  }

  getId(): any {
    return this.id
  }

  getDesignation(): string {
    return this.designation
  }

  getCreatedAt(): Date | null {
    return this.createdAt
  }
  getUpdatedAt(): Date | null {
    return this.updatedAt
  }
}
