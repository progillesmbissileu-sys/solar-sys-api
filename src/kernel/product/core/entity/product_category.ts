import string from '@adonisjs/core/helpers/string'

export class ProductCategory {
  constructor(
    private id: any,
    private designation: string,
    private type: 'CATEGORY' | 'TAG' = 'CATEGORY',
    private parentId: any | null = null,
    private slug: string | null = null,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    if (!slug) {
      this.slug = string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    }
  }

  getId(): any {
    return this.id
  }

  getParentId(): any | null {
    return this.parentId
  }

  getSlug(): string | null {
    return this.slug
  }

  getCreatedAt(): any {
    return this.createdAt
  }
  getUpdatedAt(): any {
    return this.updatedAt
  }
}
