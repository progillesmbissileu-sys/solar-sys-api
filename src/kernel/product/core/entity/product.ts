import string from '@adonisjs/core/helpers/string'

export class Product {
  constructor(
    private id: any,
    private designation: string,
    private categoryId: any,
    private description: string,
    private pictureUrl: string,
    private price: number,
    private brand?: string,
    private slug?: string,
    private isAvailable?: boolean,
    private isDeleted?: boolean,
    private createdAt: Date | null = null,
    private updatedAt: Date | null = null
  ) {
    this.slug = slug ?? string.slug(this.designation + '-' + string.generateRandom(8))
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
